// ========================================
// TESTE DE CONECTIVIDADE DA API
// ========================================

import { API_URLS, API_CONFIG, getCurrentConfig } from "src/config/apiConfig";
import axios from "axios";

type TestResult = {
  success: boolean;
  environment: string;
  url?: string;
  responseTime?: string;
  status?: number;
  error?: string;
  details?: string;
};

export const testAPIConnection = async (): Promise<TestResult> => {
  const config = getCurrentConfig();

  console.log("🧪 Iniciando teste de conectividade da API...");
  console.log(`📍 Ambiente: ${config.environment.toUpperCase()}`);
  console.log(`🌐 URL Base: ${config.baseUrl}`);
  console.log(`⏱️  Timeout: ${config.timeout}ms`);

  try {
    try {
      const healthUrl = `${config.baseUrl}/health`;
      console.log(`🔍 Testando health check: ${healthUrl}`);

      const healthResponse = await axios.get(healthUrl, { timeout: 5000 });
      console.log("✅ Health check OK:", healthResponse.data);
    } catch {
      console.log("⚠️ Health check não disponível (normal para alguns servidores)");
    }

    console.log(`🔍 Testando conectividade básica...`);

    const testPayload = { pergunta: "Teste de conectividade", id_user: "test_user" };

    const response = await axios.post(API_URLS.QUESTION, testPayload, {
      timeout: API_CONFIG.TIMEOUT,
      headers: API_CONFIG.HEADERS,
    });

    console.log("✅ Conectividade OK!");
    console.log("📥 Resposta recebida:", response.status);

    if (response.data && response.data.message) {
      console.log("📝 Estrutura de resposta válida");
      return {
        success: true,
        environment: config.environment,
        url: API_URLS.QUESTION,
        responseTime: (response.headers as any)["x-response-time"] || "N/A",
        status: response.status,
      };
    } else {
      console.log("⚠️ Resposta recebida, mas estrutura inesperada");
      return {
        success: false,
        error: "Estrutura de resposta inesperada",
        environment: config.environment,
        url: API_URLS.QUESTION,
      };
    }
  } catch (error: any) {
    console.error("❌ Erro na conectividade:", error.message);

    let errorType = "Desconhecido";
    if (error.code === "ECONNREFUSED") errorType = "Conexão recusada - servidor não está rodando";
    else if (error.code === "ECONNABORTED") errorType = "Timeout - servidor demorou muito para responder";
    else if (error.code === "ENOTFOUND") errorType = "DNS não encontrado - URL inválida";
    else if (error.response) errorType = `Erro HTTP ${error.response.status}`;

    return {
      success: false,
      error: errorType,
      details: error.message,
      environment: config.environment,
      url: API_URLS.QUESTION,
    };
  }
};

export const testFoodSearch = async () => {
  const config = getCurrentConfig();

  console.log("🍎 Testando busca de alimentos...");

  try {
    const testPayload = { pergunta: "Quantas calorias tem uma maçã?", id_user: "test_user" };

    const response = await axios.post(API_URLS.QUESTION, testPayload, {
      timeout: API_CONFIG.TIMEOUT,
      headers: API_CONFIG.HEADERS,
    });

    if (response.data && response.data.message && response.data.message.resposta) {
      const resposta: string = response.data.message.resposta;

      const lower = resposta.toLowerCase();
      const hasNutritionalInfo =
        lower.includes("caloria") ||
        lower.includes("kcal") ||
        lower.includes("proteína") ||
        lower.includes("carboidrato");

      console.log("✅ Busca de alimentos OK!");
      console.log("📝 Resposta:", resposta.substring(0, 100) + "...");
      console.log(`🔍 Contém info nutricional: ${hasNutritionalInfo ? "Sim" : "Não"}`);

      return {
        success: true,
        hasNutritionalInfo,
        responseLength: resposta.length,
        environment: config.environment,
      };
    } else {
      console.log("⚠️ Resposta recebida, mas sem dados nutricionais");
      return {
        success: false,
        error: "Resposta sem dados nutricionais",
        environment: config.environment,
      };
    }
  } catch (error: any) {
    console.error("❌ Erro na busca de alimentos:", error.message);
    return { success: false, error: error.message, environment: config.environment };
  }
};

export const runAllTests = async () => {
  console.log("🚀 Iniciando testes completos da API...\n");

  const connectivityTest = await testAPIConnection();
  console.log("\n" + "=".repeat(50));

  const foodSearchTest = await testFoodSearch();
  console.log("\n" + "=".repeat(50));

  console.log("\n📊 RESUMO DOS TESTES:");
  console.log(`📍 Ambiente: ${connectivityTest.environment.toUpperCase()}`);
  console.log(`🔗 Conectividade: ${connectivityTest.success ? "✅ OK" : "❌ FALHOU"}`);
  // @ts-ignore
  console.log(`🍎 Busca de alimentos: ${foodSearchTest.success ? "✅ OK" : "❌ FALHOU"}`);

  // @ts-ignore
  if (foodSearchTest.hasNutritionalInfo) console.log(`📋 Dados nutricionais: ✅ PRESENTES`);
  else console.log(`📋 Dados nutricionais: ⚠️ AUSENTES`);

  return {
    connectivity: connectivityTest,
    foodSearch: foodSearchTest,
    // @ts-ignore
    allPassed: connectivityTest.success && foodSearchTest.success,
  };
};

export const quickTest = async () => {
  try {
    const result = await testAPIConnection();
    if (result.success) {
      console.log("✅ API funcionando corretamente!");
      return true;
    } else {
      console.log("❌ API com problemas:", result.error);
      return false;
    }
  } catch (error: any) {
    console.log("❌ Erro no teste:", error.message);
    return false;
  }
};
