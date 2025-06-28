import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
const MAX_CACHE_SIZE = 3 * 1024 * 1024; // 3MB máximo para cache da API

class ApiCache {
    constructor() {
        this.memoryCache = new Map();
    }

    generateKey(url, params) {
        const paramString = params ? JSON.stringify(params) : '';
        return `${url}_${paramString}`;
    }

    // Função para limpar cache antigo da API
    async cleanupOldApiCache() {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const apiCacheKeys = keys.filter(key => key.startsWith('api_cache_'));
            
            if (apiCacheKeys.length > 20) {
                // Remove os caches mais antigos, mantendo apenas os 10 mais recentes
                const itemsToRemove = apiCacheKeys.slice(0, apiCacheKeys.length - 10);
                await AsyncStorage.multiRemove(itemsToRemove);
                console.log(`Limpeza automática da API: removidos ${itemsToRemove.length} caches antigos`);
            }
        } catch (error) {
            console.warn('Erro na limpeza automática do cache da API:', error);
        }
    }

    // Função para verificar tamanho do cache da API
    async checkApiCacheSize() {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const apiCacheKeys = keys.filter(key => key.startsWith('api_cache_'));
            const items = await AsyncStorage.multiGet(apiCacheKeys);
            let totalSize = 0;
            
            items.forEach(([key, value]) => {
                if (value) {
                    totalSize += value.length;
                }
            });
            
            if (totalSize > MAX_CACHE_SIZE) {
                console.log('Cache da API muito grande, iniciando limpeza...');
                await this.cleanupOldApiCache();
            }
            
            return totalSize;
        } catch (error) {
            console.warn('Erro ao verificar tamanho do cache da API:', error);
            return 0;
        }
    }

    // Função para salvar cache com tratamento de erro robusto
    async saveCacheSafely(key, data) {
        try {
            // Verifica tamanho antes de salvar
            await this.checkApiCacheSize();
            
            // Tenta salvar o cache
            await AsyncStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.warn('Erro ao salvar cache da API:', error);
            
            // Se for erro de disco cheio, tenta limpar e salvar novamente
            if (error.message.includes('SQLITE_FULL') || error.message.includes('disk is full')) {
                console.log('Disco cheio detectado na API, tentando limpeza...');
                try {
                    await this.cleanupOldApiCache();
                    // Tenta salvar novamente após limpeza
                    await AsyncStorage.setItem(key, JSON.stringify(data));
                    console.log('Cache da API salvo após limpeza');
                } catch (retryError) {
                    console.warn('Falha ao salvar cache da API mesmo após limpeza:', retryError);
                    // Se ainda falhar, apenas ignora e continua sem cache
                }
            }
        }
    }

    async get(key) {
        // Verifica cache em memória primeiro
        const memoryItem = this.memoryCache.get(key);
        if (memoryItem && Date.now() - memoryItem.timestamp < CACHE_DURATION) {
            return memoryItem.data;
        }

        // Verifica cache no AsyncStorage
        try {
            const cached = await AsyncStorage.getItem(`api_cache_${key}`);
            if (cached) {
                const item = JSON.parse(cached);
                if (Date.now() - item.timestamp < CACHE_DURATION) {
                    // Atualiza cache em memória
                    this.memoryCache.set(key, item);
                    return item.data;
                }
            }
        } catch (error) {
            console.warn('Erro ao carregar cache da API:', error);
            
            // Se for erro de disco cheio, tenta limpar
            if (error.message.includes('SQLITE_FULL') || error.message.includes('disk is full')) {
                console.log('Tentando limpeza da API devido a disco cheio...');
                await this.cleanupOldApiCache();
            }
        }

        return null;
    }

    async set(key, data) {
        const item = {
            data,
            timestamp: Date.now()
        };

        // Salva em memória
        this.memoryCache.set(key, item);

        // Salva no AsyncStorage com tratamento de erro robusto
        await this.saveCacheSafely(`api_cache_${key}`, item);
    }

    async clear() {
        this.memoryCache.clear();
        try {
            const keys = await AsyncStorage.getAllKeys();
            const cacheKeys = keys.filter(key => key.startsWith('api_cache_'));
            await AsyncStorage.multiRemove(cacheKeys);
            console.log('Cache da API limpo manualmente');
        } catch (error) {
            console.warn('Erro ao limpar cache da API:', error);
        }
    }

    async clearExpired() {
        const now = Date.now();
        
        // Limpa cache em memória
        for (const [key, item] of this.memoryCache.entries()) {
            if (now - item.timestamp >= CACHE_DURATION) {
                this.memoryCache.delete(key);
            }
        }

        // Limpa cache no AsyncStorage
        try {
            const keys = await AsyncStorage.getAllKeys();
            const cacheKeys = keys.filter(key => key.startsWith('api_cache_'));
            
            for (const key of cacheKeys) {
                const cached = await AsyncStorage.getItem(key);
                if (cached) {
                    const item = JSON.parse(cached);
                    if (now - item.timestamp >= CACHE_DURATION) {
                        await AsyncStorage.removeItem(key);
                    }
                }
            }
            console.log('Cache expirado da API limpo');
        } catch (error) {
            console.warn('Erro ao limpar cache expirado da API:', error);
        }
    }

    // Função para obter informações do cache da API
    async getCacheInfo() {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const apiCacheKeys = keys.filter(key => key.startsWith('api_cache_'));
            const items = await AsyncStorage.multiGet(apiCacheKeys);
            let totalSize = 0;
            
            items.forEach(([key, value]) => {
                if (value) {
                    totalSize += value.length;
                }
            });
            
            return {
                totalSize: totalSize,
                cacheCount: apiCacheKeys.length,
                totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
                memoryCacheSize: this.memoryCache.size
            };
        } catch (error) {
            console.warn('Erro ao obter informações do cache da API:', error);
            return { 
                totalSize: 0, 
                cacheCount: 0, 
                totalSizeMB: '0.00',
                memoryCacheSize: this.memoryCache.size
            };
        }
    }
}

export const apiCache = new ApiCache();

// Função para fazer requisições com cache
export const cachedRequest = async (url, options = {}, useCache = true) => {
    if (!useCache) {
        const response = await fetch(url, options);
        return response.json();
    }

    const key = apiCache.generateKey(url, options.body);
    const cached = await apiCache.get(key);
    
    if (cached) {
        console.log('Dados carregados do cache da API');
        return cached;
    }

    console.log('Fazendo requisição para a API...');
    const response = await fetch(url, options);
    const data = await response.json();
    
    await apiCache.set(key, data);
    return data;
};

// Função para limpar todos os caches do app
export const clearAllCaches = async () => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        const cacheKeys = keys.filter(key => 
            key.includes('cache') || 
            key.includes('temp') || 
            key.startsWith('api_cache_')
        );
        await AsyncStorage.multiRemove(cacheKeys);
        apiCache.memoryCache.clear();
        console.log('Todos os caches foram limpos');
    } catch (error) {
        console.warn('Erro ao limpar todos os caches:', error);
    }
}; 