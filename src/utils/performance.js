import { InteractionManager } from 'react-native';

// Função para executar tarefas pesadas após interações
export const runAfterInteractions = (task) => {
  return new Promise((resolve) => {
    InteractionManager.runAfterInteractions(() => {
      task();
      resolve();
    });
  });
};

/**
 * Debounce mais robusto para prevenir múltiplas execuções
 * @param {Function} func - Função a ser executada
 * @param {number} wait - Tempo de espera em ms
 * @param {boolean} immediate - Se deve executar imediatamente
 * @returns {Function} - Função debounced
 */
export function robustDebounce(func, wait, immediate = false) {
  let timeout;
  let lastCallTime = 0;
  let isExecuting = false;
  
  return function executedFunction(...args) {
    const now = Date.now();
    
    // Se já está executando, ignora
    if (isExecuting) {
      console.log('Função já está executando, ignorando chamada');
      return;
    }
    
    // Se a última chamada foi muito recente, ignora
    if (now - lastCallTime < wait) {
      console.log('Chamada muito recente, ignorando');
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
        }, 100); // Pequeno delay para garantir que não execute novamente
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

/**
 * Throttle para limitar a frequência de execução
 * @param {Function} func - Função a ser executada
 * @param {number} limit - Limite de tempo em ms
 * @returns {Function} - Função throttled
 */
export function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

/**
 * Memoize com cache baseado em tempo
 * @param {Function} func - Função a ser memoizada
 * @param {number} ttl - Tempo de vida do cache em ms
 * @returns {Function} - Função memoizada
 */
export function memoizeWithTTL(func, ttl = 60000) {
  const cache = new Map();
  
  return function(...args) {
    const key = JSON.stringify(args);
    const now = Date.now();
    
    if (cache.has(key)) {
      const { value, timestamp } = cache.get(key);
      if (now - timestamp < ttl) {
        return value;
      }
      cache.delete(key);
    }
    
    const result = func.apply(this, args);
    cache.set(key, { value: result, timestamp: now });
    return result;
  };
}

/**
 * Função para prevenir múltiplas execuções simultâneas
 * @param {Function} func - Função a ser protegida
 * @returns {Function} - Função protegida
 */
export function preventMultipleExecutions(func) {
  let isExecuting = false;
  let executionPromise = null;
  
  return async function(...args) {
    if (isExecuting) {
      console.log('Função já está executando, aguardando...');
      return executionPromise;
    }
    
    isExecuting = true;
    executionPromise = func.apply(this, args);
    
    try {
      const result = await executionPromise;
      return result;
    } finally {
      isExecuting = false;
      executionPromise = null;
    }
  };
}

// Função para limpar cache de imagens
export const clearImageCache = async () => {
  try {
    // Limpa cache de imagens se disponível
    if (global.ImageCache) {
      await global.ImageCache.clear();
    }
  } catch (error) {
    console.warn('Erro ao limpar cache de imagens:', error);
  }
};

// Função para otimizar listas grandes
export const optimizeList = (list, pageSize = 20) => {
  return {
    data: list,
    getItem: (index) => list[index],
    getItemCount: () => list.length,
    getItemLayout: (data, index) => ({
      length: 80, // Altura estimada
      offset: 80 * index,
      index,
    }),
  };
};

// Função para verificar se o dispositivo está lento
export const isSlowDevice = () => {
  // Implementação básica - pode ser expandida
  return false;
};

// Função para otimizar animações baseada no dispositivo
export const getOptimizedAnimationConfig = () => {
  const isSlow = isSlowDevice();
  return {
    duration: isSlow ? 200 : 300,
    useNativeDriver: true,
    isInteraction: false,
  };
}; 

/**
 * Função para limpar manualmente todos os caches do app
 * Útil para resolver problemas de disco cheio
 */
export async function clearAllAppCaches() {
    try {
        const { clearAllCaches } = await import('./apiCache.js');
        const { clearAllCache } = await import('./foodsLoader.js');
        
        await Promise.allSettled([
            clearAllCaches(),
            clearAllCache()
        ]);
        
        console.log('Todos os caches do app foram limpos manualmente');
        return true;
    } catch (error) {
        console.error('Erro ao limpar caches do app:', error);
        return false;
    }
}

/**
 * Função para verificar o status dos caches
 */
export async function getCacheStatus() {
    try {
        const { getCacheInfo: getApiCacheInfo } = await import('./apiCache.js');
        const { getCacheInfo: getFoodsCacheInfo } = await import('./foodsLoader.js');
        
        const [apiCacheInfo, foodsCacheInfo] = await Promise.all([
            getApiCacheInfo(),
            getFoodsCacheInfo()
        ]);
        
        return {
            api: apiCacheInfo,
            foods: foodsCacheInfo,
            total: {
                size: apiCacheInfo.totalSize + foodsCacheInfo.totalSize,
                sizeMB: ((apiCacheInfo.totalSize + foodsCacheInfo.totalSize) / (1024 * 1024)).toFixed(2),
                count: apiCacheInfo.cacheCount + foodsCacheInfo.cacheCount
            }
        };
    } catch (error) {
        console.error('Erro ao obter status dos caches:', error);
        return null;
    }
} 