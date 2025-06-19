"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";

interface VirtualizationOptions {
  containerHeight: number;
  itemHeight: number;
  overscan?: number;
  enabled?: boolean;
}

export function useVirtualization<T>(
  items: T[], 
  options: VirtualizationOptions
) {
  const { containerHeight, itemHeight, overscan = 5, enabled = true } = options;
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const virtualizedData = useMemo(() => {
    if (!enabled || items.length === 0) {
      return {
        virtualItems: items.map((item, index) => ({ item, index })),
        totalHeight: items.length * itemHeight,
        offsetY: 0,
      };
    }

    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    const virtualItems = [];
    for (let i = startIndex; i <= endIndex; i++) {
      virtualItems.push({
        item: items[i],
        index: i,
      });
    }

    return {
      virtualItems,
      totalHeight: items.length * itemHeight,
      offsetY: startIndex * itemHeight,
    };
  }, [items, scrollTop, containerHeight, itemHeight, overscan, enabled]);

  return {
    ...virtualizedData,
    scrollElementRef,
    handleScroll,
  };
}

// Hook for infinite scroll with virtualization
export function useInfiniteVirtualization<T>(
  items: T[],
  loadMore: () => Promise<void>,
  options: VirtualizationOptions & {
    hasNextPage?: boolean;
    isFetchingNextPage?: boolean;
    threshold?: number;
  }
) {
  const {
    hasNextPage = true,
    isFetchingNextPage = false,
    threshold = 5,
    ...virtualOptions
  } = options;

  const { virtualItems, totalHeight, offsetY, scrollElementRef, handleScroll } = 
    useVirtualization(items, virtualOptions);

  const loadMoreRef = useRef(loadMore);
  loadMoreRef.current = loadMore;

  const handleScrollWithLoadMore = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    handleScroll(e);
    
    const { scrollTop: currentScrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    
    // Trigger load more when near bottom
    if (
      distanceFromBottom < threshold * virtualOptions.itemHeight &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      loadMoreRef.current();
    }
  }, [handleScroll, threshold, virtualOptions.itemHeight, hasNextPage, isFetchingNextPage]);

  return {
    virtualItems,
    totalHeight,
    offsetY,
    scrollElementRef,
    handleScroll: handleScrollWithLoadMore,
    hasNextPage,
    isFetchingNextPage,
  };
}

// Hook for search with debouncing
export function useDebouncedSearch(
  initialValue: string = "",
  delay: number = 300
) {
  const [searchValue, setSearchValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [searchValue, delay]);

  return {
    searchValue,
    debouncedValue,
    setSearchValue,
  };
}

// Hook for optimized filtering
export function useOptimizedFilter<T>(
  items: T[],
  filterFn: (item: T, query: string) => boolean,
  searchQuery: string,
  options: {
    enabled?: boolean;
    chunkSize?: number;
  } = {}
) {
  const { enabled = true, chunkSize = 100 } = options;

  return useMemo(() => {
    if (!enabled || !searchQuery.trim()) {
      return items;
    }

    // For large datasets, process in chunks to avoid blocking the UI
    if (items.length > chunkSize * 10) {
      const filtered: T[] = [];
      const query = searchQuery.toLowerCase().trim();
      
      for (let i = 0; i < items.length; i += chunkSize) {
        const chunk = items.slice(i, i + chunkSize);
        const chunkFiltered = chunk.filter(item => filterFn(item, query));
        filtered.push(...chunkFiltered);
        
        // Allow other tasks to run
        if (i % (chunkSize * 2) === 0) {
          break;
        }
      }
      
      return filtered;
    }

    return items.filter(item => filterFn(item, searchQuery.toLowerCase().trim()));
  }, [items, filterFn, searchQuery, enabled, chunkSize]);
}
