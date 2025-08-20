import AsyncStorage from "@react-native-async-storage/async-storage";

let foodsCache: any[] | null = null;
let isLoading = false;
let loadPromise: Promise<any[]> | null = null;

const cleanupOldCache = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter((key) => key.includes("cache") || key.includes("temp"));

    if (cacheKeys.length > 10) {
      const itemsToRemove = cacheKeys.slice(0, cacheKeys.length - 5);
      await AsyncStorage.multiRemove(itemsToRemove);
      console.log(`Limpeza automática: removidos ${itemsToRemove.length} caches antigos`);
    }
  } catch (error) {
    console.warn("Erro na limpeza automática do cache:", error as any);
  }
};

const checkStorageSpace = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const items = await AsyncStorage.multiGet(keys);
    let totalSize = 0;

    items.forEach(([_, value]) => {
      if (value) totalSize += value.length;
    });

    if (totalSize > 5 * 1024 * 1024) {
      console.log("Cache muito grande, iniciando limpeza...");
      await cleanupOldCache();
    }

    return totalSize;
  } catch (error) {
    console.warn("Erro ao verificar espaço de armazenamento:", error as any);
    return 0;
  }
};

const saveCacheSafely = async (key: string, data: any) => {
  try {
    await checkStorageSpace();
    await AsyncStorage.setItem(key, JSON.stringify(data));
    console.log("Cache salvo com sucesso");
  } catch (error: any) {
    console.warn("Erro ao salvar cache:", error);
    const msg = String(error?.message || "");
    if (msg.includes("SQLITE_FULL") || msg.includes("disk is full")) {
      console.log("Disco cheio detectado, tentando limpeza...");
      try {
        await cleanupOldCache();
        await AsyncStorage.setItem(key, JSON.stringify(data));
        console.log("Cache salvo após limpeza");
      } catch (retryError) {
        console.warn("Falha ao salvar cache mesmo após limpeza:", retryError as any);
      }
    }
  }
};

const loadFoodsJsonLazy = async () => {
  try {
    console.log("Carregando dados de alimentos do arquivo JSON...");
    const foodsData = require("src/pages/main/foods.json");

    const alimentosOtimizados = foodsData.map((item: any) => ({
      ...item,
      descricaoNormalizada: (item.descricao || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase(),
    }));

    console.log(`Dados de alimentos carregados: ${alimentosOtimizados.length} itens`);
    return alimentosOtimizados;
  } catch (error) {
    console.error("Erro ao carregar dados de alimentos:", error);
    throw error;
  }
};

export const loadFoodsData = async (): Promise<any[]> => {
  if (isLoading && loadPromise) return loadPromise;
  if (foodsCache) return foodsCache;

  try {
    const cached = await AsyncStorage.getItem("foods_data_cache");
    if (cached) {
      foodsCache = JSON.parse(cached);
      console.log("Cache de alimentos carregado do AsyncStorage");
      return foodsCache;
    }
  } catch (error: any) {
    console.warn("Erro ao carregar cache de alimentos:", error);
    const msg = String(error?.message || "");
    if (msg.includes("SQLITE_FULL") || msg.includes("disk is full")) {
      console.log("Tentando limpeza devido a disco cheio...");
      await cleanupOldCache();
    }
  }

  isLoading = true;
  loadPromise = new Promise<any[]>(async (resolve, reject) => {
    try {
      const alimentosOtimizados = await loadFoodsJsonLazy();
      foodsCache = alimentosOtimizados;
      await saveCacheSafely("foods_data_cache", alimentosOtimizados);
      resolve(alimentosOtimizados);
    } catch (error) {
      console.error("Erro ao carregar dados de alimentos:", error);
      reject(error);
    } finally {
      isLoading = false;
      loadPromise = null;
    }
  });

  return loadPromise;
};

export const clearFoodsCache = async () => {
  foodsCache = null;
  try {
    await AsyncStorage.removeItem("foods_data_cache");
    console.log("Cache de alimentos limpo manualmente");
  } catch (error) {
    console.warn("Erro ao limpar cache de alimentos:", error as any);
  }
};

export const clearAllCache = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter((key) => key.includes("cache") || key.includes("temp"));
    await AsyncStorage.multiRemove(cacheKeys);
    foodsCache = null;
    console.log("Todos os caches foram limpos");
  } catch (error) {
    console.warn("Erro ao limpar todos os caches:", error as any);
  }
};

export const getFoodsCache = () => foodsCache;

export const getCacheInfo = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const items = await AsyncStorage.multiGet(keys);
    let totalSize = 0;
    let cacheCount = 0;

    items.forEach(([key, value]) => {
      if (value && (key.includes("cache") || key.includes("temp"))) {
        totalSize += value.length;
        cacheCount++;
      }
    });

    return { totalSize, cacheCount, totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2) };
  } catch (error) {
    console.warn("Erro ao obter informações do cache:", error as any);
    return { totalSize: 0, cacheCount: 0, totalSizeMB: "0.00" };
  }
};
