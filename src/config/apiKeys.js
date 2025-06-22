// Configuração da API de Clínicas
// ✅ Agora usando OpenStreetMap - sem necessidade de chaves de API!

// Configuração de ambiente
export const API_CONFIG = {
  // URLs base das APIs públicas
  OPENSTREETMAP_BASE_URL: 'https://www.openstreetmap.org',
  NOMINATIM_BASE_URL: 'https://nominatim.openstreetmap.org',
  
  // Configurações de busca
  DEFAULT_SEARCH_RADIUS: 5000, // 5km em metros
  MAX_CLINICS_RESULTS: 20,
  
  // Configurações de cache
  CACHE_DURATION: 30 * 60 * 1000, // 30 minutos em millisegundos
  
  // Configurações de timeout
  REQUEST_TIMEOUT: 10000, // 10 segundos
};

// Função para verificar se a configuração está correta
export const validateApiConfig = () => {
  return {
    isValid: true, // Sempre válido, não precisa de chaves
    message: 'Configuração OK - usando OpenStreetMap'
  };
};

// Função para obter mensagem de status
export const getApiStatusMessage = () => {
  return `✅ API configurada com sucesso!
  
Vantagens da nova implementação:
• Totalmente gratuito
• Sem necessidade de chaves de API
• Sem verificação de identidade
• Funciona imediatamente

Usando: OpenStreetMap + APIs públicas`;
}; 