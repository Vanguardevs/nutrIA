import { loadFoodsData } from "./foodsLoader";

let searchCache = new Map<string, any[]>();
let foodsDataCache: any[] | null = null;

const normalizeText = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const calculateSimilarity = (query: string, text: string) => {
  const queryWords = query.split(/\s+/);
  const textWords = text.split(/\s+/);
  let matches = 0;
  queryWords.forEach((queryWord) => {
    textWords.forEach((textWord) => {
      if (textWord.includes(queryWord) || queryWord.includes(textWord)) matches++;
    });
  });
  return matches / Math.max(queryWords.length, textWords.length);
};

export const simpleFoodSearch = async (
  query: string,
  options: { maxResults?: number; minSimilarity?: number; useCache?: boolean } = {},
) => {
  const { maxResults = 6, minSimilarity = 0.1, useCache = true } = options;

  const normalizedQuery = normalizeText(query);
  if (normalizedQuery.length < 2) return [] as any[];

  const cacheKey = `${normalizedQuery}_${maxResults}`;
  if (useCache && searchCache.has(cacheKey)) {
    console.log("Resultado encontrado no cache de busca");
    return searchCache.get(cacheKey)!;
  }

  try {
    if (!foodsDataCache) {
      console.log("Carregando dados de alimentos...");
      foodsDataCache = await loadFoodsData();
      console.log(`Dados carregados: ${foodsDataCache.length} alimentos`);
    }

    const results: any[] = [];

    (foodsDataCache as any[]).forEach((food: any, index: number) => {
      const descricao: string = food.descricao || "";
      const descricaoNormalizada = normalizeText(descricao);
      const similarity = calculateSimilarity(normalizedQuery, descricaoNormalizada);

      let keywordBonus = 0;
      const keywords = ["caloria", "energia", "proteina", "carboidrato", "gordura"];
      keywords.forEach((keyword) => {
        if (normalizedQuery.includes(keyword)) keywordBonus += 0.2;
      });

      const finalScore = similarity + keywordBonus;

      if (finalScore >= minSimilarity) {
        results.push({ ...food, relevanceScore: finalScore, originalIndex: index });
      }
    });

    results.sort((a, b) => b.relevanceScore - a.relevanceScore);
    const finalResults = results.slice(0, maxResults);

    if (useCache && finalResults.length > 0) {
      searchCache.set(cacheKey, finalResults);
      if (searchCache.size > 50) {
        const firstKey = searchCache.keys().next().value as string;
        searchCache.delete(firstKey);
      }
    }

    console.log(`Busca simples: "${query}" retornou ${finalResults.length} resultados`);
    return finalResults;
  } catch (error) {
    console.error("Erro na busca simples:", error);
    return [] as any[];
  }
};

export const buscarSugestoesParaIA = async (texto: string, options: any = {}) => {
  if (!texto || texto.length < 2) return [] as any[];

  try {
    const resultados = await simpleFoodSearch(texto, {
      maxResults: 6,
      minSimilarity: 0.1,
      useCache: true,
      ...options,
    });
    return resultados;
  } catch (error) {
    console.error("Erro na busca de sugestões para IA:", error);
    return [] as any[];
  }
};

export const getNutritionalInfo = (alimento: any) => {
  if (!alimento) {
    console.log("❌ Alimento é null ou undefined");
    return null as any;
  }
  if (!alimento.nutrientes || !Array.isArray(alimento.nutrientes)) {
    console.log("❌ Alimento não tem nutrientes ou nutrientes não é array:", alimento.descricao);
    return null as any;
  }

  console.log(`🔍 Processando nutrientes para: ${alimento.descricao}`);
  console.log(`   Número de nutrientes: ${alimento.nutrientes.length}`);

  const nutrientes: Record<string, { valor: any; unidades: any }> = {};
  alimento.nutrientes.forEach((nutriente: any, index: number) => {
    const componente = nutriente.Componente;
    const valor = nutriente["Valor por 100g"];
    const unidades = nutriente.Unidades;
    console.log(`   Nutriente ${index + 1}: ${componente} = ${valor} ${unidades}`);
    if (componente && valor !== undefined) nutrientes[componente] = { valor, unidades };
  });

  const result = {
    descricao: alimento.descricao,
    calorias: nutrientes["Energia"]?.valor || null,
    proteinas: nutrientes["Proteína"]?.valor || null,
    carboidratos: nutrientes["Carboidrato"]?.valor || null,
    gorduras: nutrientes["Lipídeos"]?.valor || null,
    fibras: nutrientes["Fibra alimentar"]?.valor || null,
    sodio: nutrientes["Sódio"]?.valor || null,
    todosNutrientes: nutrientes,
  };

  console.log("✅ Informações nutricionais extraídas:", result);
  return result;
};

export const clearSearchCache = () => {
  searchCache.clear();
  console.log("Cache de busca limpo");
};

export const getSearchStats = () => ({
  cacheSize: searchCache.size,
  dataLoaded: !!foodsDataCache,
  dataSize: foodsDataCache ? (foodsDataCache as any[]).length : 0,
});
