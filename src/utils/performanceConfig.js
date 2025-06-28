// Configurações de performance que podem ser desabilitadas se necessário
export const PERFORMANCE_CONFIG = {
    // Cache de alimentos
    ENABLE_FOODS_CACHE: true,
    
    // Cache de API
    ENABLE_API_CACHE: true,
    
    // Otimizações de FlatList
    ENABLE_FLATLIST_OPTIMIZATIONS: true,
    
    // Otimizações de animação
    ENABLE_ANIMATION_OPTIMIZATIONS: true,
    
    // Debug mode
    DEBUG_MODE: false,
};

// Função para verificar se uma otimização está habilitada
export const isOptimizationEnabled = (key) => {
    return PERFORMANCE_CONFIG[key] === true;
};

// Função para desabilitar uma otimização em tempo de execução
export const disableOptimization = (key) => {
    PERFORMANCE_CONFIG[key] = false;
    if (PERFORMANCE_CONFIG.DEBUG_MODE) {
        console.warn(`Otimização ${key} foi desabilitada`);
    }
};

// Função para habilitar uma otimização em tempo de execução
export const enableOptimization = (key) => {
    PERFORMANCE_CONFIG[key] = true;
    if (PERFORMANCE_CONFIG.DEBUG_MODE) {
        console.log(`Otimização ${key} foi habilitada`);
    }
};

// Função para resetar todas as configurações
export const resetPerformanceConfig = () => {
    PERFORMANCE_CONFIG.ENABLE_FOODS_CACHE = true;
    PERFORMANCE_CONFIG.ENABLE_API_CACHE = true;
    PERFORMANCE_CONFIG.ENABLE_FLATLIST_OPTIMIZATIONS = true;
    PERFORMANCE_CONFIG.ENABLE_ANIMATION_OPTIMIZATIONS = true;
    PERFORMANCE_CONFIG.DEBUG_MODE = false;
}; 