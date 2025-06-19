import React, { useEffect, useRef, useCallback, useMemo } from 'react';

/**
 * Performance utilities for React components optimization
 */

// Debounce hook for expensive operations
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Throttle hook for frequent operations
export function useThrottle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCallTime = useRef<number>(0);

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      
      if (now - lastCallTime.current >= delay) {
        lastCallTime.current = now;
        return func(...args);
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
          lastCallTime.current = Date.now();
          func(...args);
        }, delay - (now - lastCallTime.current));
      }
    }) as T,
    [func, delay]
  );
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    
    if (!element) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [elementRef, options]);

  return isIntersecting;
}

// Memoized selector hook for Zustand
export function useStoreSelector<T, U>(
  store: (state: T) => T,
  selector: (state: T) => U,
  equalityFn?: (a: U, b: U) => boolean
): U {
  return useMemo(() => {
    const state = store(state => state);
    return selector(state);
  }, [store, selector]);
}

// Image optimization utility
export interface ImageOptimizationOptions {
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  width?: number;
  height?: number;
  blur?: boolean;
}

export function optimizeImageUrl(
  originalUrl: string,
  options: ImageOptimizationOptions = {}
): string {
  // If it's a Riot Games CDN URL, apply Community Dragon optimizations
  if (originalUrl.includes('communitydragon.org') || originalUrl.includes('raw.communitydragon.org')) {
    const url = new URL(originalUrl);
    
    if (options.width) {
      url.searchParams.set('width', options.width.toString());
    }
    if (options.height) {
      url.searchParams.set('height', options.height.toString());
    }
    if (options.quality) {
      url.searchParams.set('quality', options.quality.toString());
    }
    
    return url.toString();
  }
  
  // For other URLs, return as-is or apply local optimization
  return originalUrl;
}

// Memory cleanup utility
export function useCleanup(cleanup: () => void, deps: React.DependencyList = []) {
  useEffect(() => {
    return cleanup;
  }, deps);
}

// Virtual scrolling utility
export function useVirtualization<T>(
  items: T[],
  containerHeight: number,
  itemHeight: number,
  overscan: number = 5
) {
  const [scrollTop, setScrollTop] = React.useState(0);
  
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );
  
  const visibleItems = items.slice(startIndex, endIndex + 1);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;
  
  return {
    visibleItems,
    totalHeight,
    offsetY,
    startIndex,
    endIndex,
    setScrollTop,
  };
}

// Resource preloader
export class ResourcePreloader {
  private static instance: ResourcePreloader;
  private preloadedImages = new Map<string, HTMLImageElement>();
  private preloadQueue = new Set<string>();
  
  static getInstance(): ResourcePreloader {
    if (!ResourcePreloader.instance) {
      ResourcePreloader.instance = new ResourcePreloader();
    }
    return ResourcePreloader.instance;
  }
  
  async preloadImage(url: string): Promise<HTMLImageElement> {
    if (this.preloadedImages.has(url)) {
      return this.preloadedImages.get(url)!;
    }
    
    if (this.preloadQueue.has(url)) {
      // Wait for existing preload to complete
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (this.preloadedImages.has(url)) {
            clearInterval(checkInterval);
            resolve(this.preloadedImages.get(url)!);
          }
        }, 50);
      });
    }
    
    this.preloadQueue.add(url);
    
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.preloadedImages.set(url, img);
        this.preloadQueue.delete(url);
        resolve(img);
      };
      
      img.onerror = () => {
        this.preloadQueue.delete(url);
        reject(new Error(`Failed to preload image: ${url}`));
      };
      
      img.src = url;
    });
  }
  
  preloadImages(urls: string[]): Promise<HTMLImageElement[]> {
    return Promise.all(urls.map(url => this.preloadImage(url)));
  }
  
  clearCache(): void {
    this.preloadedImages.clear();
    this.preloadQueue.clear();
  }
  
  getCacheSize(): number {
    return this.preloadedImages.size;
  }
}

// Component performance monitoring
export function usePerformanceMonitor(componentName: string) {
  const renderStart = useRef<number>(0);
  const renderCount = useRef<number>(0);
  
  useEffect(() => {
    renderStart.current = performance.now();
    renderCount.current += 1;
  });
  
  useEffect(() => {
    const renderTime = performance.now() - renderStart.current;
    
    if (renderTime > 16) { // More than one frame (60fps)
      console.warn(
        `${componentName} render took ${renderTime.toFixed(2)}ms (render #${renderCount.current})`
      );
    }
  });
}

// Batch operations utility
export function useBatchedUpdates<T>(
  items: T[],
  batchSize: number = 10,
  delay: number = 0
) {
  const [processedItems, setProcessedItems] = React.useState<T[]>([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  
  useEffect(() => {
    if (currentIndex >= items.length) return;
    
    const timer = setTimeout(() => {
      const nextBatch = items.slice(currentIndex, currentIndex + batchSize);
      setProcessedItems(prev => [...prev, ...nextBatch]);
      setCurrentIndex(prev => prev + batchSize);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [items, currentIndex, batchSize, delay]);
  
  // Reset when items change
  useEffect(() => {
    setProcessedItems([]);
    setCurrentIndex(0);
  }, [items]);
  
  return {
    processedItems,
    isComplete: currentIndex >= items.length,
    progress: Math.min(currentIndex / items.length, 1),
  };
}

export default {
  useDebounce,
  useThrottle,
  useIntersectionObserver,
  useStoreSelector,
  optimizeImageUrl,
  useCleanup,
  useVirtualization,
  ResourcePreloader,
  usePerformanceMonitor,
  useBatchedUpdates,
};
