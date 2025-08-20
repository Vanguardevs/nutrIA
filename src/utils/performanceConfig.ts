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
} as const;

export type PerformanceConfigKey = keyof typeof PERFORMANCE_CONFIG;

export const isOptimizationEnabled = (key: PerformanceConfigKey) => {
  return PERFORMANCE_CONFIG[key] === true;
};

export const disableOptimization = (key: PerformanceConfigKey) => {
  // @ts-ignore - We intentionally mutate for runtime toggling
  (PERFORMANCE_CONFIG as any)[key] = false;
  if (PERFORMANCE_CONFIG.DEBUG_MODE) {
    console.warn(`Otimização ${key} foi desabilitada`);
  }
};

export const enableOptimization = (key: PerformanceConfigKey) => {
  // @ts-ignore - We intentionally mutate for runtime toggling
  (PERFORMANCE_CONFIG as any)[key] = true;
  if (PERFORMANCE_CONFIG.DEBUG_MODE) {
    console.log(`Otimização ${key} foi habilitada`);
  }
};

export const resetPerformanceConfig = () => {
  // @ts-ignore runtime mutation
  (PERFORMANCE_CONFIG as any).ENABLE_FOODS_CACHE = true;
  (PERFORMANCE_CONFIG as any).ENABLE_API_CACHE = true;
  (PERFORMANCE_CONFIG as any).ENABLE_FLATLIST_OPTIMIZATIONS = true;
  (PERFORMANCE_CONFIG as any).ENABLE_ANIMATION_OPTIMIZATIONS = true;
  (PERFORMANCE_CONFIG as any).DEBUG_MODE = false;
};
