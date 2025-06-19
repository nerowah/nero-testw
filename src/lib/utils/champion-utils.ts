import { Champion } from "@/lib/types";

// Cache for search results to improve performance
const searchCache = new Map<string, Champion[]>();
const CACHE_MAX_SIZE = 100;

/**
 * Optimized champion filtering with caching and improved search logic
 */
export function filterAndSortChampions(
  champions: Champion[],
  searchQuery: string,
  favorites: Set<number>
): Champion[] {
  const normalizedQuery = searchQuery.toLowerCase().trim();
  const cacheKey = `${normalizedQuery}-${Array.from(favorites).sort().join(',')}-${champions.length}`;
  
  // Check cache first
  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey)!;
  }

  let result: Champion[];

  if (!normalizedQuery) {
    // No search query - just sort by favorites and name
    result = [...champions].sort((a, b) => {
      const aFav = favorites.has(a.id);
      const bFav = favorites.has(b.id);
      if (aFav !== bFav) return aFav ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  } else {
    // Filter and rank by search relevance
    const championsWithScores = champions
      .map(champion => ({
        champion,
        score: getMatchScore(champion.name, normalizedQuery),
        isFavorite: favorites.has(champion.id)
      }))
      .filter(item => item.score > 0)
      .sort((a, b) => {
        // First sort by favorite status
        if (a.isFavorite !== b.isFavorite) {
          return a.isFavorite ? -1 : 1;
        }
        
        // Then by search score
        if (a.score !== b.score) {
          return b.score - a.score;
        }
        
        // Finally alphabetically
        return a.champion.name.localeCompare(b.champion.name);
      });

    result = championsWithScores.map(item => item.champion);
  }

  // Manage cache size
  if (searchCache.size >= CACHE_MAX_SIZE) {
    const firstKey = searchCache.keys().next().value;
    searchCache.delete(firstKey);
  }
  
  searchCache.set(cacheKey, result);
  return result;
}

/**
 * Enhanced match scoring with fuzzy search support
 */
export function getMatchScore(championName: string, query: string): number {
  const normalizedName = championName.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  // Exact match gets highest score
  if (normalizedName === normalizedQuery) return 100;

  // Starts with query gets very high score
  if (normalizedName.startsWith(normalizedQuery)) return 90;

  // Check for acronym matches (e.g., "mf" for "Miss Fortune")
  const acronymScore = getAcronymScore(championName, query);
  if (acronymScore > 0) return 85 + acronymScore;

  // Contains query as a whole word gets high score
  const wordBoundaryRegex = new RegExp(`\\b${escapeRegExp(normalizedQuery)}\\b`);
  if (wordBoundaryRegex.test(normalizedName)) return 80;

  // Contains query gets medium score
  if (normalizedName.includes(normalizedQuery)) return 60;

  // Fuzzy matching for typos (simple edit distance)
  const fuzzyScore = getFuzzyScore(normalizedName, normalizedQuery);
  if (fuzzyScore > 0.7) return Math.floor(40 * fuzzyScore);

  // No match
  return 0;
}

/**
 * Calculate acronym match score
 */
function getAcronymScore(championName: string, query: string): number {
  const words = championName.split(/\s+|'/);
  const acronym = words.map(word => word[0]?.toLowerCase()).join('');
  
  if (acronym === query.toLowerCase()) return 10;
  if (acronym.startsWith(query.toLowerCase())) return 5;
  
  return 0;
}

/**
 * Simple fuzzy matching using normalized edit distance
 */
function getFuzzyScore(str1: string, str2: string): number {
  if (str1.length === 0) return str2.length === 0 ? 1 : 0;
  if (str2.length === 0) return 0;

  const maxLength = Math.max(str1.length, str2.length);
  const distance = levenshteinDistance(str1, str2);
  
  return 1 - (distance / maxLength);
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) {
    matrix[0][i] = i;
  }

  for (let j = 0; j <= str2.length; j++) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Escape special regex characters
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Clear the search cache (useful for memory management)
 */
export function clearSearchCache(): void {
  searchCache.clear();
}

/**
 * Group champions by role/position for better organization
 */
export function groupChampionsByRole(champions: Champion[]): Record<string, Champion[]> {
  const groups: Record<string, Champion[]> = {
    assassin: [],
    fighter: [],
    mage: [],
    marksman: [],
    support: [],
    tank: [],
    other: []
  };

  champions.forEach(champion => {
    // This would need actual role data from the champion object
    // For now, using a simple fallback
    const role = champion.tags?.[0]?.toLowerCase() || 'other';
    const groupKey = groups[role] ? role : 'other';
    groups[groupKey].push(champion);
  });

  return groups;
}

/**
 * Get recently selected champions (would need to integrate with storage)
 */
export function getRecentChampions(champions: Champion[], recentIds: number[], limit: number = 5): Champion[] {
  return recentIds
    .slice(0, limit)
    .map(id => champions.find(champ => champ.id === id))
    .filter((champ): champ is Champion => champ !== undefined);
}

/**
 * Search champions with debounced execution for better performance
 */
export function createDebouncedSearch(
  delay: number = 300
): (champions: Champion[], query: string, favorites: Set<number>) => Promise<Champion[]> {
  let timeoutId: NodeJS.Timeout;
  
  return (champions: Champion[], query: string, favorites: Set<number>) => {
    return new Promise((resolve) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        resolve(filterAndSortChampions(champions, query, favorites));
      }, delay);
    });
  };
}
