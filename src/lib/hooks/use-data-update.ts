import { useState, useCallback, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";
import { DataUpdateProgress, DataUpdateResult } from "../types";
import {
  fetchChampionSummaries,
  fetchChampionDetails,
  fetchFantomeFile,
  transformChampionData,
  sanitizeForFileName,
} from "../data-utils";

// Helper function to delay execution
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Enhanced retry mechanism with exponential backoff
const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Exponential backoff with jitter
      const delayMs = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
      await delay(delayMs);
    }
  }
  
  throw lastError!;
};

// Rate limiter for API calls
class RateLimiter {
  private queue: Array<() => void> = [];
  private processing = false;
  private readonly interval: number;

  constructor(requestsPerSecond: number = 10) {
    this.interval = 1000 / requestsPerSecond;
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

  private async process() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    
    while (this.queue.length > 0) {
      const fn = this.queue.shift()!;
      await fn();
      await delay(this.interval);
    }
    
    this.processing = false;
  }
}

export function useDataUpdate() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [progress, setProgress] = useState<DataUpdateProgress | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const rateLimiter = useRef(new RateLimiter(8)); // 8 requests per second

  // Enhanced progress update with throttling
  const updateProgress = useCallback((updates: Partial<DataUpdateProgress>) => {
    setProgress(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  const updateData = useCallback(async () => {
    if (isUpdating) {
      return;
    }

    // Create abort controller for cancellation support
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    const loadingToastId = toast("Updating data...");

    try {
      setIsUpdating(true);
      updateProgress({
        currentChampion: "",
        totalChampions: 0,
        processedChampions: 0,
        status: "checking",
        progress: 0,
      });

      // Check for updates with retry
      const updateResult = await retryWithBackoff(
        () => invoke<DataUpdateResult>("check_data_updates"),
        2,
        500
      );
      
      const dataExists = await invoke<boolean>("check_champions_data");

      // Check if operation was cancelled
      if (signal.aborted) {
        throw new Error("Operation cancelled");
      }

      // If updates are needed or no data exists, proceed with update
      if (
        !dataExists ||
        (updateResult.updatedChampions &&
          updateResult.updatedChampions.length > 0)
      ) {
        // Fetch champion summaries with retry
        const summaries = await retryWithBackoff(
          () => fetchChampionSummaries(),
          3,
          1000
        );
        
        const validSummaries = summaries.filter((summary) => summary.id > 0);
        const totalChampions = validSummaries.length;

        updateProgress({
          totalChampions,
          status: "downloading",
        });

        // Update loading toast with download info
        toast.dismiss(loadingToastId);
        const downloadToastId = toast(`Downloading data for ${totalChampions} champions`);

        // Optimized batch processing with dynamic batch size
        const INITIAL_BATCH_SIZE = 8;
        const MAX_BATCH_SIZE = 15;
        const DELAY_BETWEEN_BATCHES = 300;
        
        let currentBatchSize = INITIAL_BATCH_SIZE;
        let processedCount = 0;
        let errorCount = 0;

        for (let i = 0; i < validSummaries.length; i += currentBatchSize) {
          // Check for cancellation
          if (signal.aborted) {
            throw new Error("Operation cancelled");
          }

          const batch = validSummaries.slice(i, i + currentBatchSize);
          const batchStartTime = Date.now();

          // Process each champion in the batch with rate limiting
          const batchPromises = batch.map(async (summary) => {
            return rateLimiter.current.add(async () => {
              try {
                updateProgress({
                  currentChampion: summary.name,
                  processedChampions: processedCount,
                  status: "processing",
                  progress: (processedCount / totalChampions) * 100,
                });

                // Fetch champion details with retry
                const details = await retryWithBackoff(
                  () => fetchChampionDetails(summary.id),
                  2,
                  500
                );

                // Process skins concurrently with limit
                const skinPromises = details.skins
                  .filter((_, index) => index > 0) // Skip base skin
                  .map(async (skin) => {
                    try {
                      // Extract base skin ID
                      const baseSkinId = skin.id % 1000;
                      
                      // Fetch fantome content with retry
                      const fantomeContent = await retryWithBackoff(
                        () => fetchFantomeFile(summary.id, baseSkinId),
                        2,
                        300
                      );

                      // Save regular skin fantome file
                      await invoke("save_fantome_file", {
                        championName: sanitizeForFileName(summary.name),
                        skinName: sanitizeForFileName(skin.name),
                        isChroma: false,
                        content: fantomeContent,
                      });

                      // Process chromas if they exist
                      if (skin.chromas && skin.chromas.length > 0) {
                        const chromaPromises = skin.chromas.map(async (chroma) => {
                          try {
                            const chromaContent = await retryWithBackoff(
                              () => fetchFantomeFile(summary.id, chroma.id),
                              2,
                              300
                            );
                            
                            await invoke("save_fantome_file", {
                              championName: sanitizeForFileName(summary.name),
                              skinName: sanitizeForFileName(`${skin.name} ${chroma.name}`),
                              isChroma: true,
                              content: chromaContent,
                            });
                          } catch (chromaError) {
                            console.warn(`Failed to process chroma ${chroma.name}:`, chromaError);
                          }
                        });

                        await Promise.allSettled(chromaPromises);
                      }
                    } catch (skinError) {
                      console.warn(`Failed to process skin ${skin.name}:`, skinError);
                    }
                  });

                await Promise.allSettled(skinPromises);

                // Transform and save champion data
                const transformedChampion = transformChampionData(summary, details);
                await invoke("save_champion_data", {
                  championId: summary.id,
                  data: transformedChampion,
                });

                processedCount++;
                return true;
              } catch (error) {
                errorCount++;
                console.error(`Failed to process champion ${summary.name}:`, error);
                return false;
              }
            });
          });

          const batchResults = await Promise.allSettled(batchPromises);
          const batchTime = Date.now() - batchStartTime;

          // Adaptive batch sizing based on performance
          if (batchTime < 2000 && errorCount === 0) {
            currentBatchSize = Math.min(currentBatchSize + 2, MAX_BATCH_SIZE);
          } else if (batchTime > 5000 || errorCount > 0) {
            currentBatchSize = Math.max(currentBatchSize - 1, 3);
          }

          // Reset error count for next batch
          errorCount = 0;

          // Update progress
          updateProgress({
            processedChampions: processedCount,
            progress: (processedCount / totalChampions) * 100,
          });

          // Delay between batches (adaptive)
          if (i + currentBatchSize < validSummaries.length) {
            await delay(batchTime > 3000 ? DELAY_BETWEEN_BATCHES * 1.5 : DELAY_BETWEEN_BATCHES);
          }
        }

        // Finalize update
        updateProgress({
          status: "finalizing",
          progress: 100,
        });

        await invoke("finalize_champion_data_update");

        toast.dismiss(downloadToastId);
        toast.success(`Successfully updated ${processedCount} champions!`);
      } else {
        toast.dismiss(loadingToastId);
        toast.info("Champion data is already up to date");
      }
    } catch (error) {
      console.error("Data update failed:", error);
      toast.dismiss(loadingToastId);
      
      if (error instanceof Error && error.message === "Operation cancelled") {
        toast.info("Update cancelled");
      } else {
        toast.error(
          error instanceof Error 
            ? `Update failed: ${error.message}` 
            : "Failed to update champion data"
        );
      }
      throw error;
    } finally {
      setIsUpdating(false);
      setProgress(null);
      abortControllerRef.current = null;
    }
  }, [isUpdating, updateProgress]);

  // Cancel update function
  const cancelUpdate = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    updateData,
    cancelUpdate,
    isUpdating,
    progress,
  };
}
