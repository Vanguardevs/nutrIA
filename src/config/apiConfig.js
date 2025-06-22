// ========================================
// CONFIGURAÇÃO DE API - AMBIENTES
// ========================================

import { Platform } from 'react-native';

// Função para detectar o IP correto baseado na plataforma
const getLocalhostIP = () => {
    if (Platform.OS === 'android') {
        return '10.0.2.2'; // IP especial para emulador Android
    }
    return 'localhost'; // Para iOS e desenvolvimento
};

// Configurações por ambiente
const ENVIRONMENTS = {
    LOCAL: {
        name: 'local',
        baseUrl: `http://${getLocalhostIP()}:8000`, // IP dinâmico baseado na plataforma
        questionEndpoint: '/question',
        timeout: 10000,
        retries: 2
    },
    RENDER: {
        name: 'render',
        baseUrl: 'https://nutria-6uny.onrender.com',
        questionEndpoint: '/question',
        timeout: 15000,
        retries: 3
    },
    PRODUCTION: {
        name: 'production',
        baseUrl: 'https://nutria-6uny.onrender.com', // Mesmo do Render por enquanto
        questionEndpoint: '/question',
        timeout: 15000,
        retries: 3
    }
};

// Ambiente atual - MUDAR AQUI para alternar entre local e render
const CURRENT_ENV = 'RENDER'; // Mude para 'RENDER' quando quiser usar o servidor online

// Configuração atual
const currentConfig = ENVIRONMENTS[CURRENT_ENV];

// URLs completas
export const API_URLS = {
    QUESTION: `${currentConfig.baseUrl}${currentConfig.questionEndpoint}`,
    BASE_URL: currentConfig.baseUrl
};

// Configurações de requisição
export const API_CONFIG = {
    TIMEOUT: currentConfig.timeout,
    RETRIES: currentConfig.retries,
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

// Função para obter configuração atual
export const getCurrentConfig = () => {
    return {
        environment: currentConfig.name,
        baseUrl: currentConfig.baseUrl,
        timeout: currentConfig.timeout,
        retries: currentConfig.retries,
        platform: Platform.OS
    };
};

// Função para verificar se está em desenvolvimento
export const isDevelopment = () => {
    return CURRENT_ENV === 'LOCAL';
};

// Função para verificar se está em produção
export const isProduction = () => {
    return CURRENT_ENV === 'PRODUCTION';
};

// Log da configuração atual
console.log(`🚀 API Configurada para: ${currentConfig.name.toUpperCase()}`);
console.log(`📍 URL Base: ${currentConfig.baseUrl}`);
console.log(`📱 Plataforma: ${Platform.OS}`);
console.log(`⏱️  Timeout: ${currentConfig.timeout}ms`);
console.log(`🔄 Retries: ${currentConfig.retries}`);

export default {
    API_URLS,
    API_CONFIG,
    getCurrentConfig,
    isDevelopment,
    isProduction
}; 