import AsyncStorage from "@react-native-async-storage/async-storage";

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
const MAX_CACHE_SIZE = 3 * 1024 * 1024; // 3MB máximo para cache da API

interface CacheItem<T = any> {
  data: T;
  timestamp: number;
}

class ApiCache {
  private memoryCache = new Map<string, CacheItem>();

  generateKey(url: string, params?: any) {
    const paramString = params ? JSON.stringify(params) : "";
    return `${url}_${paramString}`;
  }

  async cleanupOldApiCache() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const apiCacheKeys = keys.filter((key) => key.startsWith("api_cache_"));

      if (apiCacheKeys.length > 20) {
        const itemsToRemove = apiCacheKeys.slice(0, apiCacheKeys.length - 10);
        await AsyncStorage.multiRemove(itemsToRemove);
        console.log(`Limpeza automática da API: removidos ${itemsToRemove.length} caches antigos`);
      }
    } catch (error) {
      console.warn("Erro na limpeza automática do cache da API:", error as any);
    }
  }

  async checkApiCacheSize() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const apiCacheKeys = keys.filter((key) => key.startsWith("api_cache_"));
      const items = await AsyncStorage.multiGet(apiCacheKeys);
      let totalSize = 0;

      items.forEach(([_, value]) => {
        if (value) totalSize += value.length;
      });

      if (totalSize > MAX_CACHE_SIZE) {
        console.log("Cache da API muito grande, iniciando limpeza...");
        await this.cleanupOldApiCache();
      }

      return totalSize;
    } catch (error) {
      console.warn("Erro ao verificar tamanho do cache da API:", error as any);
      return 0;
    }
  }

  private async saveCacheSafely(key: string, data: CacheItem) {
    try {
      await this.checkApiCacheSize();
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error: any) {
      console.warn("Erro ao salvar cache da API:", error);
      const msg = String(error?.message || "");
      if (msg.includes("SQLITE_FULL") || msg.includes("disk is full")) {
        console.log("Disco cheio detectado na API, tentando limpeza...");
        try {
          await this.cleanupOldApiCache();
          await AsyncStorage.setItem(key, JSON.stringify(data));
          console.log("Cache da API salvo após limpeza");
        } catch (retryError) {
          console.warn("Falha ao salvar cache da API mesmo após limpeza:", retryError as any);
        }
      }
    }
  }

  async get<T = any>(key: string): Promise<T | null> {
    const memoryItem = this.memoryCache.get(key);
    if (memoryItem && Date.now() - memoryItem.timestamp < CACHE_DURATION) {
      return memoryItem.data as T;
    }

    try {
      const cached = await AsyncStorage.getItem(`api_cache_${key}`);
      if (cached) {
        const item: CacheItem<T> = JSON.parse(cached);
        if (Date.now() - item.timestamp < CACHE_DURATION) {
          this.memoryCache.set(key, item as CacheItem);
          return item.data;
        }
      }
    } catch (error: any) {
      console.warn("Erro ao carregar cache da API:", error);
      const msg = String(error?.message || "");
      if (msg.includes("SQLITE_FULL") || msg.includes("disk is full")) {
        console.log("Tentando limpeza da API devido a disco cheio...");
        await this.cleanupOldApiCache();
      }
    }

    return null;
  }

  async set<T = any>(key: string, data: T) {
    const item: CacheItem<T> = { data, timestamp: Date.now() };
    this.memoryCache.set(key, item as CacheItem);
    await this.saveCacheSafely(`api_cache_${key}`, item as CacheItem);
  }

  async clear() {
    this.memoryCache.clear();
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter((key) => key.startsWith("api_cache_"));
      await AsyncStorage.multiRemove(cacheKeys);
      console.log("Cache da API limpo manualmente");
    } catch (error) {
      console.warn("Erro ao limpar cache da API:", error as any);
    }
  }

  async clearExpired() {
    const now = Date.now();

    for (const [key, item] of this.memoryCache.entries()) {
      if (now - item.timestamp >= CACHE_DURATION) this.memoryCache.delete(key);
    }

    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter((key) => key.startsWith("api_cache_"));
      for (const key of cacheKeys) {
        const cached = await AsyncStorage.getItem(key);
        if (cached) {
          const item: CacheItem = JSON.parse(cached);
          if (now - item.timestamp >= CACHE_DURATION) await AsyncStorage.removeItem(key);
        }
      }
      console.log("Cache expirado da API limpo");
    } catch (error) {
      console.warn("Erro ao limpar cache expirado da API:", error as any);
    }
  }

  async getCacheInfo() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const apiCacheKeys = keys.filter((key) => key.startsWith("api_cache_"));
      const items = await AsyncStorage.multiGet(apiCacheKeys);
      let totalSize = 0;

      items.forEach(([_, value]) => {
        if (value) totalSize += value.length;
      });

      return {
        totalSize,
        cacheCount: apiCacheKeys.length,
        totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
        memoryCacheSize: this.memoryCache.size,
      };
    } catch (error) {
      console.warn("Erro ao obter informações do cache da API:", error as any);
      return {
        totalSize: 0,
        cacheCount: 0,
        totalSizeMB: "0.00",
        memoryCacheSize: this.memoryCache.size,
      };
    }
  }
}

export const apiCache = new ApiCache();

export const cachedRequest = async <T = any>(
  url: string,
  options: RequestInit = {},
  useCache = true,
): Promise<T> => {
  if (!useCache) {
    const response = await fetch(url, options);
    return response.json();
  }

  const key = apiCache.generateKey(url, (options as any).body);
  const cached = await apiCache.get<T>(key);

  if (cached) {
    console.log("Dados carregados do cache da API");
    return cached;
  }

  console.log("Fazendo requisição para a API...");
  const response = await fetch(url, options);
  const data = (await response.json()) as T;

  await apiCache.set(key, data);
  return data;
};

export const clearAllCaches = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(
      (key) => key.includes("cache") || key.includes("temp") || key.startsWith("api_cache_"),
    );
    await AsyncStorage.multiRemove(cacheKeys);
    (apiCache as any).memoryCache?.clear?.();
    console.log("Todos os caches foram limpos");
  } catch (error) {
    console.warn("Erro ao limpar todos os caches:", error as any);
  }
};

// Helper to expose cache info similar to original JS API
export const getCacheInfo = async () => {
  return apiCache.getCacheInfo();
};
