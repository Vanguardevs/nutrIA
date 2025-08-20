import { Platform } from "react-native";

// Função para detectar o IP correto baseado na plataforma
const getLocalhostIP = (): string => {
  if (Platform.OS === "android") {
    return "10.0.2.2"; // IP especial para emulador Android
  }
  return "localhost"; // Para iOS e desenvolvimento
};

type EnvConfig = {
  name: string;
  baseUrl: string;
  questionEndpoint: string;
  timeout: number;
  retries: number;
};

const ENVIRONMENTS: Record<"LOCAL" | "RENDER" | "PRODUCTION", EnvConfig> = {
  LOCAL: {
    name: "local",
    baseUrl: `http://${getLocalhostIP()}:8000`,
    questionEndpoint: "/question",
    timeout: 10000,
    retries: 2,
  },
  RENDER: {
    name: "render",
    baseUrl: "http://34.95.173.174:8000",
    questionEndpoint: "/question",
    timeout: 15000,
    retries: 3,
  },
  PRODUCTION: {
    name: "production",
    baseUrl: "http://34.95.173.174:8000",
    questionEndpoint: "/question",
    timeout: 15000,
    retries: 3,
  },
};

// Ambiente atual - MUDAR AQUI para alternar entre local e render
// Use a non-literal variable to avoid TS2367 constant comparison warnings
let CURRENT_ENV: keyof typeof ENVIRONMENTS = "RENDER";

const currentConfig = ENVIRONMENTS[CURRENT_ENV];

// URLs completas
export const API_URLS = {
  QUESTION: `${currentConfig.baseUrl}${currentConfig.questionEndpoint}`,
  BASE_URL: currentConfig.baseUrl,
};

// Configurações de requisição
export const API_CONFIG = {
  TIMEOUT: currentConfig.timeout,
  RETRIES: currentConfig.retries,
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
} as const;

// Função para obter configuração atual
export const getCurrentConfig = () => {
  return {
    environment: currentConfig.name,
    baseUrl: currentConfig.baseUrl,
    timeout: currentConfig.timeout,
    retries: currentConfig.retries,
    platform: Platform.OS,
  };
};

// Função para verificar se está em desenvolvimento
export const isDevelopment = (): boolean => currentConfig.name === "local";

// Função para verificar se está em produção
export const isProduction = (): boolean => currentConfig.name === "production";

// Log da configuração atual
/* eslint-disable no-console */
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
  isProduction,
};
