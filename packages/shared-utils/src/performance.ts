/**
 * Performance optimization utilities
 */

/**
 * Memoization cache for expensive function calls
 */
export class MemoizeCache<T> {
  private cache: Map<string, { value: T; timestamp: number }> = new Map();
  private ttl: number;

  constructor(ttl: number = 60000) {
    this.ttl = ttl;
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  set(key: string, value: T): void {
    this.cache.set(key, { value, timestamp: Date.now() });
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

/**
 * Memoize a function with optional TTL
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  ttl: number = 60000
): T {
  const cache = new MemoizeCache<ReturnType<T>>(ttl);
  const keyGenerator = (...args: Parameters<T>): string => {
    return JSON.stringify(args);
  };

  return ((...args: Parameters<T>) => {
    const key = keyGenerator(...args);
    const cached = cache.get(key);
    
    if (cached !== null) {
      return cached;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Batch operations for improved performance
 */
export async function batch<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize: number = 10
): Promise<R[]> {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);
  }
  
  return results;
}

/**
 * Debounce with immediate option
 */
export function debounceImmediate<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  let lastArgs: Parameters<T> | null = null;

  return function(this: any, ...args: Parameters<T>) {
    lastArgs = args;
    
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func.apply(this, lastArgs!);
      timeout = null;
    }, wait);
  };
}

/**
 * Throttle function execution
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  let lastResult: ReturnType<T>;

  return function(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      lastResult = func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
    return lastResult;
  };
}
