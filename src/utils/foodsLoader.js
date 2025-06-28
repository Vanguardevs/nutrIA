import AsyncStorage from '@react-native-async-storage/async-storage';

let foodsCache = null;
let isLoading = false;
let loadPromise = null;

// Função para limpar cache antigo e liberar espaço
const cleanupOldCache = async () => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        const cacheKeys = keys.filter(key => key.includes('cache') || key.includes('temp'));
        
        if (cacheKeys.length > 10) {
            // Remove os caches mais antigos, mantendo apenas os 5 mais recentes
            const itemsToRemove = cacheKeys.slice(0, cacheKeys.length - 5);
            await AsyncStorage.multiRemove(itemsToRemove);
            console.log(`Limpeza automática: removidos ${itemsToRemove.length} caches antigos`);
        }
    } catch (error) {
        console.warn('Erro na limpeza automática do cache:', error);
    }
};

// Função para verificar espaço disponível
const checkStorageSpace = async () => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        const items = await AsyncStorage.multiGet(keys);
        let totalSize = 0;
        
        items.forEach(([key, value]) => {
            if (value) {
                totalSize += value.length;
            }
        });
        
        // Se o tamanho total for maior que 5MB, limpa o cache
        if (totalSize > 5 * 1024 * 1024) {
            console.log('Cache muito grande, iniciando limpeza...');
            await cleanupOldCache();
        }
        
        return totalSize;
    } catch (error) {
        console.warn('Erro ao verificar espaço de armazenamento:', error);
        return 0;
    }
};

// Função para salvar cache com tratamento de erro robusto
const saveCacheSafely = async (key, data) => {
    try {
        // Verifica espaço antes de salvar
        await checkStorageSpace();
        
        // Tenta salvar o cache
        await AsyncStorage.setItem(key, JSON.stringify(data));
        console.log('Cache salvo com sucesso');
    } catch (error) {
        console.warn('Erro ao salvar cache:', error);
        
        // Se for erro de disco cheio, tenta limpar e salvar novamente
        if (error.message.includes('SQLITE_FULL') || error.message.includes('disk is full')) {
            console.log('Disco cheio detectado, tentando limpeza...');
            try {
                await cleanupOldCache();
                // Tenta salvar novamente após limpeza
                await AsyncStorage.setItem(key, JSON.stringify(data));
                console.log('Cache salvo após limpeza');
            } catch (retryError) {
                console.warn('Falha ao salvar cache mesmo após limpeza:', retryError);
                // Se ainda falhar, apenas ignora e continua sem cache
            }
        }
    }
};

// Carregamento lazy do foods.json - só carrega quando necessário
const loadFoodsJsonLazy = async () => {
    try {
        console.log('Carregando dados de alimentos do arquivo JSON...');
        // Usa dynamic import para carregar apenas quando necessário
        const foodsData = await import('../pages/main/foods.json');
        
        // Otimiza os dados para busca
        const alimentosOtimizados = foodsData.default.map(item => ({
            ...item,
            descricaoNormalizada: (item.descricao || '').normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()
        }));

        console.log(`Dados de alimentos carregados: ${alimentosOtimizados.length} itens`);
        return alimentosOtimizados;
    } catch (error) {
        console.error('Erro ao carregar dados de alimentos:', error);
        throw error;
    }
};

export const loadFoodsData = async () => {
    // Se já está carregando, retorna a promise existente
    if (isLoading && loadPromise) {
        return loadPromise;
    }

    // Se já está em cache, retorna imediatamente
    if (foodsCache) {
        return foodsCache;
    }

    // Verifica se existe no AsyncStorage
    try {
        const cached = await AsyncStorage.getItem('foods_data_cache');
        if (cached) {
            foodsCache = JSON.parse(cached);
            console.log('Cache de alimentos carregado do AsyncStorage');
            return foodsCache;
        }
    } catch (error) {
        console.warn('Erro ao carregar cache de alimentos:', error);
        
        // Se for erro de disco cheio, tenta limpar
        if (error.message.includes('SQLITE_FULL') || error.message.includes('disk is full')) {
            console.log('Tentando limpeza devido a disco cheio...');
            await cleanupOldCache();
        }
    }

    // Carrega do arquivo JSON usando lazy loading
    isLoading = true;
    loadPromise = new Promise(async (resolve, reject) => {
        try {
            const alimentosOtimizados = await loadFoodsJsonLazy();
            foodsCache = alimentosOtimizados;

            // Salva no cache com tratamento de erro robusto
            await saveCacheSafely('foods_data_cache', alimentosOtimizados);

            resolve(alimentosOtimizados);
        } catch (error) {
            console.error('Erro ao carregar dados de alimentos:', error);
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
        await AsyncStorage.removeItem('foods_data_cache');
        console.log('Cache de alimentos limpo manualmente');
    } catch (error) {
        console.warn('Erro ao limpar cache de alimentos:', error);
    }
};

export const clearAllCache = async () => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        const cacheKeys = keys.filter(key => key.includes('cache') || key.includes('temp'));
        await AsyncStorage.multiRemove(cacheKeys);
        foodsCache = null;
        console.log('Todos os caches foram limpos');
    } catch (error) {
        console.warn('Erro ao limpar todos os caches:', error);
    }
};

export const getFoodsCache = () => foodsCache;

// Função para obter informações do cache
export const getCacheInfo = async () => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        const items = await AsyncStorage.multiGet(keys);
        let totalSize = 0;
        let cacheCount = 0;
        
        items.forEach(([key, value]) => {
            if (value && (key.includes('cache') || key.includes('temp'))) {
                totalSize += value.length;
                cacheCount++;
            }
        });
        
        return {
            totalSize: totalSize,
            cacheCount: cacheCount,
            totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2)
        };
    } catch (error) {
        console.warn('Erro ao obter informações do cache:', error);
        return { totalSize: 0, cacheCount: 0, totalSizeMB: '0.00' };
    }
}; 