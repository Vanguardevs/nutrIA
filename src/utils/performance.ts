import { InteractionManager } from "react-native";

export const runAfterInteractions = (task: () => void) => {
  return new Promise<void>((resolve) => {
    InteractionManager.runAfterInteractions(() => {
      task();
      resolve();
    });
  });
};

export function robustDebounce<T extends (...args: any[]) => any>(func: T, wait: number, immediate = false) {
  let timeout: any;
  let lastCallTime = 0;
  let isExecuting = false;

  return function executedFunction(this: any, ...args: Parameters<T>) {
    const now = Date.now();

    if (isExecuting) {
      return;
    }

    if (now - lastCallTime < wait) {
      return;
    }

    const later = () => {
      timeout = null;
      if (!immediate) {
        isExecuting = true;
        lastCallTime = Date.now();
        func.apply(this, args);
        setTimeout(() => {
          isExecuting = false;
        }, 100);
      }
    };

    const callNow = immediate && !timeout;

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) {
      isExecuting = true;
      lastCallTime = Date.now();
      func.apply(this, args);
      setTimeout(() => {
        isExecuting = false;
      }, 100);
    }
  };
}

export function throttle<T extends (...args: any[]) => void>(func: T, limit: number) {
  let inThrottle = false;
  return function (this: any, ...args: Parameters<T>) {
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function memoizeWithTTL<T extends (...args: any[]) => any>(func: T, ttl = 60000) {
  const cache = new Map<string, { value: ReturnType<T>; timestamp: number }>();

  return function (this: any, ...args: Parameters<T>): ReturnType<T> {
    const key = JSON.stringify(args);
    const now = Date.now();

    if (cache.has(key)) {
      const { value, timestamp } = cache.get(key)!;
      if (now - timestamp < ttl) return value;
      cache.delete(key);
    }

    const result = func.apply(this, args) as ReturnType<T>;
    cache.set(key, { value: result, timestamp: now });
    return result;
  };
}

export function preventMultipleExecutions<T extends (...args: any[]) => Promise<any>>(func: T) {
  let isExecuting = false;
  let executionPromise: Promise<any> | null = null;

  return async function (this: any, ...args: Parameters<T>): Promise<ReturnType<T>> {
    if (isExecuting) {
      return executionPromise as Promise<any> as Promise<ReturnType<T>>;
    }

    isExecuting = true;
    executionPromise = func.apply(this, args);

    try {
      const result = await executionPromise;
      return result as ReturnType<T>;
    } finally {
      isExecuting = false;
      executionPromise = null;
    }
  };
}

export const clearImageCache = async () => {
  try {
    if ((global as any).ImageCache) {
      await (global as any).ImageCache.clear();
    }
  } catch (error) {
    console.warn("Erro ao limpar cache de imagens:", error as any);
  }
};

export const optimizeList = (list: any[], pageSize = 20) => {
  return {
    data: list,
    getItem: (index: number) => list[index],
    getItemCount: () => list.length,
    getItemLayout: (_data: any, index: number) => ({ length: 80, offset: 80 * index, index }),
  };
};

export const isSlowDevice = () => {
  return false;
};

export const getOptimizedAnimationConfig = () => {
  const isSlow = isSlowDevice();
  return { duration: isSlow ? 200 : 300, useNativeDriver: true, isInteraction: false } as const;
};

import { clearAllCaches, getCacheInfo as getApiCacheInfo } from "src/utils/apiCache";
import { clearAllCache, getCacheInfo as getFoodsCacheInfo } from "src/utils/foodsLoader";

export async function clearAllAppCaches() {
  try {
    await Promise.allSettled([clearAllCaches(), clearAllCache()]);
    console.log("Todos os caches do app foram limpos manualmente");
    return true;
  } catch (error) {
    console.error("Erro ao limpar caches do app:", error);
    return false;
  }
}

export async function getCacheStatus() {
  try {
    const [apiCacheInfo, foodsCacheInfo] = await Promise.all([getApiCacheInfo(), getFoodsCacheInfo()]);
    return {
      api: apiCacheInfo,
      foods: foodsCacheInfo,
      total: {
        size: apiCacheInfo.totalSize + foodsCacheInfo.totalSize,
        sizeMB: ((apiCacheInfo.totalSize + foodsCacheInfo.totalSize) / (1024 * 1024)).toFixed(2),
        count: apiCacheInfo.cacheCount + foodsCacheInfo.cacheCount,
      },
    };
  } catch (error) {
    console.error("Erro ao obter status dos caches:", error);
    return null as any;
  }
}
