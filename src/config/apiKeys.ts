// Configuração da API de Clínicas (TypeScript)

export const API_CONFIG = {
  // URLs base das APIs públicas
  OPENSTREETMAP_BASE_URL: "https://www.openstreetmap.org",
  NOMINATIM_BASE_URL: "https://nominatim.openstreetmap.org",

  // Configurações de busca
  DEFAULT_SEARCH_RADIUS: 5000, // 5km em metros
  MAX_CLINICS_RESULTS: 20,

  // Configurações de cache
  CACHE_DURATION: 30 * 60 * 1000, // 30 minutos em millisegundos

  // Configurações de timeout
  REQUEST_TIMEOUT: 10000, // 10 segundos
} as const;

export const validateApiConfig = () => {
  return {
    isValid: true,
    message: "Configuração OK - usando OpenStreetMap",
  } as const;
};

export const getApiStatusMessage = () => {
  return `✅ API configurada com sucesso!\n  \nVantagens da nova implementação:\n• Totalmente gratuito\n• Sem necessidade de chaves de API\n• Sem verificação de identidade\n• Funciona imediatamente\n\nUsando: OpenStreetMap + APIs públicas`;
};

export default {
  API_CONFIG,
  validateApiConfig,
  getApiStatusMessage,
};
