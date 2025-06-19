import { Champion, ChampionInSummary, Skin, Chroma } from "./types";

// API Base URLs
const COMMUNITY_DRAGON_BASE_URL =
  "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default";
const FANTOME_BASE_URL =
  "https://raw.githubusercontent.com/nerowah/lol-skins-developer/main";

// Configuration
const CONFIG = {
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  TIMEOUT: 30000,
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
  MAX_CONCURRENT_REQUESTS: 6,
} as const;

// Cache implementation
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

class DataCache {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly maxSize = 1000;

  set<T>(key: string, data: T, ttl: number = CONFIG.CACHE_TTL): void {
    // Clean up expired entries if cache is getting large
    if (this.cache.size >= this.maxSize) {
      this.cleanup();
    }

    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiry: now + ttl,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }

    // If still too large, remove oldest entries
    if (this.cache.size >= this.maxSize) {
      const entries = Array.from(this.cache.entries())
        .sort(([, a], [, b]) => a.timestamp - b.timestamp);
      
      const toRemove = entries.slice(0, Math.floor(this.maxSize * 0.2));
      toRemove.forEach(([key]) => this.cache.delete(key));
    }
  }

  getStats() {
    const now = Date.now();
    const total = this.cache.size;
    const expired = Array.from(this.cache.values()).filter(
      entry => now > entry.expiry
    ).length;

    return {
      total,
      active: total - expired,
      expired,
      memoryUsage: this.getMemoryUsage(),
    };
  }

  private getMemoryUsage(): number {
    // Rough estimation of memory usage
    let size = 0;
    for (const [key, entry] of this.cache.entries()) {
      size += key.length * 2; // String chars are 2 bytes
      size += JSON.stringify(entry.data).length * 2;
      size += 24; // Estimated overhead per entry
    }
    return size;
  }
}

// Global cache instance
const dataCache = new DataCache();

// Enhanced error class for better error handling
export class DataFetchError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode?: number,
    public readonly retryable: boolean = true
  ) {
    super(message);
    this.name = "DataFetchError";
  }
}

// Request queue for rate limiting
class RequestQueue {
  private queue: Array<() => Promise<void>> = [];
  private processing = false;
  private readonly concurrency: number;
  private activeRequests = 0;

  constructor(concurrency: number = CONFIG.MAX_CONCURRENT_REQUESTS) {
    this.concurrency = concurrency;
  }

  async add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.process();
    });
  }

  private async process(): Promise<void> {
    if (this.processing || this.activeRequests >= this.concurrency) return;
    
    const fn = this.queue.shift();
    if (!fn) return;

    this.activeRequests++;
    this.processing = true;

    try {
      await fn();
    } finally {
      this.activeRequests--;
      
      // Process next item if available
      if (this.queue.length > 0 && this.activeRequests < this.concurrency) {
        // Small delay to prevent overwhelming the server
        setTimeout(() => this.process(), 50);
      } else {
        this.processing = false;
      }
    }
  }

  getStats() {
    return {
      queueLength: this.queue.length,
      activeRequests: this.activeRequests,
      concurrency: this.concurrency,
    };
  }
}

// Global request queue
const requestQueue = new RequestQueue();

// Enhanced fetch with retry logic and timeout
async function enhancedFetch(
  url: string,
  options: RequestInit = {},
  retryCount = 0
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const isRetryable = response.status >= 500 || response.status === 429;
      throw new DataFetchError(
        `HTTP ${response.status}: ${response.statusText}`,
        "HTTP_ERROR",
        response.status,
        isRetryable
      );
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof DataFetchError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof TypeError || error.name === "AbortError") {
      const isTimeout = error.name === "AbortError";
      const retryable = retryCount < CONFIG.RETRY_ATTEMPTS;

      if (retryable && (isTimeout || error instanceof TypeError)) {
        const delay = CONFIG.RETRY_DELAY * Math.pow(2, retryCount);
        await new Promise(resolve => setTimeout(resolve, delay));
        return enhancedFetch(url, options, retryCount + 1);
      }

      throw new DataFetchError(
        isTimeout ? "Request timeout" : "Network error",
        isTimeout ? "TIMEOUT" : "NETWORK_ERROR",
        undefined,
        retryable
      );
    }

    throw error;
  }
}

// Champion Details Interface
interface ChampionDetails {
  skins: Array<{
    id: number;
    name: string;
    loadScreenPath: string;
    isBase: boolean;
    skinType: string;
    rarity: string;
    featuresText: string | null;
    chromas?: Array<{
      id: number;
      name: string;
      chromaPath: string;
      colors: string[];
      description: string;
      rarity: string;
    }>;
  }>;
}

// Asset URL construction with validation
function constructAssetUrl(path: string): string {
  if (!path || typeof path !== "string") {
    throw new DataFetchError("Invalid asset path", "INVALID_PATH", undefined, false);
  }

  // Remove leading slash if present
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  // Remove the 'lol-game-data/assets/' prefix if present and convert to lowercase
  const transformedPath = cleanPath
    .replace("lol-game-data/assets/", "")
    .toLowerCase();

  return `${COMMUNITY_DRAGON_BASE_URL}/${transformedPath}`;
}

// Enhanced data fetching functions with caching and error handling
export async function fetchChampionSummaries(): Promise<ChampionInSummary[]> {
  const cacheKey = "champion-summaries";
  
  // Check cache first
  const cached = dataCache.get<ChampionInSummary[]>(cacheKey);
  if (cached) {
    return cached;
  }

  return requestQueue.add(async () => {
    try {
      const response = await enhancedFetch(
        `${COMMUNITY_DRAGON_BASE_URL}/v1/champion-summary.json`
      );
      
      const data = (await response.json()) as ChampionInSummary[];
      
      // Validate data structure
      if (!Array.isArray(data)) {
        throw new DataFetchError(
          "Invalid champion summaries format",
          "INVALID_DATA",
          undefined,
          false
        );
      }

      // Cache the result
      dataCache.set(cacheKey, data);
      
      return data;
    } catch (error) {
      if (error instanceof DataFetchError) {
        throw error;
      }
      throw new DataFetchError(
        `Failed to fetch champion summaries: ${error}`,
        "FETCH_ERROR"
      );
    }
  });
}

export async function fetchChampionDetails(id: number): Promise<ChampionDetails> {
  if (!id || id <= 0) {
    throw new DataFetchError("Invalid champion ID", "INVALID_ID", undefined, false);
  }

  const cacheKey = `champion-details-${id}`;
  
  // Check cache first
  const cached = dataCache.get<ChampionDetails>(cacheKey);
  if (cached) {
    return cached;
  }

  return requestQueue.add(async () => {
    try {
      const response = await enhancedFetch(
        `${COMMUNITY_DRAGON_BASE_URL}/v1/champions/${id}.json`
      );
      
      const data = (await response.json()) as ChampionDetails;
      
      // Validate data structure
      if (!data || !Array.isArray(data.skins)) {
        throw new DataFetchError(
          "Invalid champion details format",
          "INVALID_DATA",
          undefined,
          false
        );
      }

      // Cache the result with shorter TTL for champion details
      dataCache.set(cacheKey, data, CONFIG.CACHE_TTL / 2);
      
      return data;
    } catch (error) {
      if (error instanceof DataFetchError) {
        throw error;
      }
      throw new DataFetchError(
        `Failed to fetch details for champion ${id}: ${error}`,
        "FETCH_ERROR"
      );
    }
  });
}

export async function fetchFantomeFile(
  championId: number,
  skinId: number
): Promise<Uint8Array> {
  if (!championId || championId <= 0 || !skinId || skinId < 0) {
    throw new DataFetchError("Invalid champion or skin ID", "INVALID_ID", undefined, false);
  }

  const cacheKey = `fantome-${championId}-${skinId}`;
  
  // Check cache first (with longer TTL for binary files)
  const cached = dataCache.get<Uint8Array>(cacheKey);
  if (cached) {
    return cached;
  }

  return requestQueue.add(async () => {
    try {
      const response = await enhancedFetch(
        `${FANTOME_BASE_URL}/${championId}/${skinId}.fantome`
      );
      
      const arrayBuffer = await response.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      
      // Validate that we received data
      if (data.length === 0) {
        throw new DataFetchError(
          "Empty fantome file received",
          "EMPTY_FILE",
          undefined,
          false
        );
      }

      // Cache with longer TTL for binary files
      dataCache.set(cacheKey, data, CONFIG.CACHE_TTL * 4);
      
      return data;
    } catch (error) {
      if (error instanceof DataFetchError) {
        throw error;
      }
      throw new DataFetchError(
        `Failed to fetch fantome file for champion ${championId}, skin ${skinId}: ${error}`,
        "FETCH_ERROR"
      );
    }
  });
}

// Enhanced filename sanitization
export function sanitizeForFileName(input: string): string {
  if (!input || typeof input !== "string") {
    return "Unknown";
  }

  return input
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, "") // Remove invalid characters
    .replace(/\s+/g, " ") // Normalize spaces
    .trim()
    .substring(0, 100) // Limit length
    || "Unknown"; // Fallback if empty after sanitization
}

// Enhanced champion data transformation with validation
export function transformChampionData(
  summary: ChampionInSummary,
  details: ChampionDetails
): Champion {
  try {
    const validSkins = details.skins
      .filter(skin => skin && skin.id && skin.name)
      .map((skin): Skin => {
        const transformedSkin: Skin = {
          id: skin.id,
          name: skin.name || "Unknown Skin",
          loadScreenPath: skin.loadScreenPath
            ? constructAssetUrl(skin.loadScreenPath)
            : "",
          isBase: Boolean(skin.isBase),
          skinType: skin.skinType || "Normal",
          rarity: skin.rarity || "Standard",
          featuresText: skin.featuresText || null,
          chromas: skin.chromas
            ? skin.chromas
                .filter(chroma => chroma && chroma.id && chroma.name)
                .map((chroma): Chroma => ({
                  id: chroma.id,
                  name: chroma.name,
                  chromaPath: chroma.chromaPath
                    ? constructAssetUrl(chroma.chromaPath)
                    : "",
                  colors: Array.isArray(chroma.colors) ? chroma.colors : [],
                  description: chroma.description || "",
                  rarity: chroma.rarity || "Standard",
                }))
            : [],
        };
        return transformedSkin;
      });

    const champion: Champion = {
      id: summary.id,
      name: summary.name || "Unknown Champion",
      alias: summary.alias || "",
      squarePortraitPath: summary.squarePortraitPath
        ? constructAssetUrl(summary.squarePortraitPath)
        : "",
      skins: validSkins,
    };

    return champion;
  } catch (error) {
    throw new DataFetchError(
      `Failed to transform champion data: ${error}`,
      "TRANSFORM_ERROR",
      undefined,
      false
    );
  }
}

// Utility functions for cache management
export function clearDataCache(): void {
  dataCache.clear();
}

export function getDataCacheStats() {
  return {
    cache: dataCache.getStats(),
    requestQueue: requestQueue.getStats(),
  };
}

// Prefetch commonly used data
export async function prefetchCommonData(): Promise<void> {
  try {
    // Prefetch champion summaries as they're always needed
    await fetchChampionSummaries();
  } catch (error) {
    console.warn("Failed to prefetch common data:", error);
  }
}

// Health check function
export async function checkDataSourceHealth(): Promise<{
  communityDragon: boolean;
  fantomeRepository: boolean;
  cacheHealth: any;
}> {
  const results = {
    communityDragon: false,
    fantomeRepository: false,
    cacheHealth: getDataCacheStats(),
  };

  try {
    const response = await enhancedFetch(
      `${COMMUNITY_DRAGON_BASE_URL}/v1/champion-summary.json`,
      { method: "HEAD" }
    );
    results.communityDragon = response.ok;
  } catch {
    results.communityDragon = false;
  }

  try {
    const response = await enhancedFetch(
      `${FANTOME_BASE_URL}/1/0.fantome`,
      { method: "HEAD" }
    );
    results.fantomeRepository = response.ok;
  } catch {
    results.fantomeRepository = false;
  }

  return results;
}

// Export cache instance for advanced usage
export { dataCache };
