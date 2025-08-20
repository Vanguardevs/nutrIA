import { loadFoodsData } from "./foodsLoader";

type Food = any; // You can refine this type later if a schema exists

let searchCache = new Map<string, any[]>();
let foodsDataCache: Food[] | null = null;

const normalizeText = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

export const basicFoodSearch = async (
  query: string,
  options: { maxResults?: number; minSimilarity?: number; useCache?: boolean } = {},
) => {
  const { maxResults = 6, minSimilarity = 0.1, useCache = true } = options;

  const normalizedQuery = normalizeText(query);
  if (normalizedQuery.length < 2) return [] as any[];

  const cacheKey = `${normalizedQuery}_${maxResults}`;
  if (useCache && searchCache.has(cacheKey)) return searchCache.get(cacheKey)!;

  try {
    if (!foodsDataCache) foodsDataCache = await loadFoodsData();

    const results: any[] = [];

    (foodsDataCache as any[]).forEach((food: any, index: number) => {
      const descricao: string = food.descricao || "";
      const descricaoNormalizada = normalizeText(descricao);

      if (descricaoNormalizada.includes(normalizedQuery)) {
        results.push({ ...food, relevanceScore: 1.0, originalIndex: index });
      } else {
        const queryWords = normalizedQuery.split(/\s+/);
        let matches = 0;
        queryWords.forEach((word) => {
          if (descricaoNormalizada.includes(word)) matches++;
        });
        if (matches > 0) {
          const score = matches / queryWords.length;
          if (score >= minSimilarity) results.push({ ...food, relevanceScore: score, originalIndex: index });
        }
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

    return finalResults;
  } catch (error) {
    console.error("Erro na busca básica:", error);
    return [] as any[];
  }
};

export const buscarSugestoesParaIA = async (texto: string, options: any = {}) => {
  if (!texto || texto.length < 2) return [] as any[];
  try {
    return await basicFoodSearch(texto, { maxResults: 6, minSimilarity: 0.1, useCache: true, ...options });
  } catch (error) {
    console.error("Erro na busca de sugestões para IA:", error);
    return [] as any[];
  }
};

export const getNutritionalInfo = (alimento: any) => {
  if (!alimento || !alimento.nutrientes) return null as any;

  const nutrientes: Record<string, { valor: any; unidades: any }> = {};

  alimento.nutrientes.forEach((nutriente: any) => {
    const componente = nutriente.Componente;
    const valor = nutriente["Valor por 100g"];
    const unidades = nutriente.Unidades;
    if (componente && valor !== undefined) nutrientes[componente] = { valor, unidades };
  });

  return {
    descricao: alimento.descricao,
    calorias: nutrientes["Energia"]?.valor || null,
    proteinas: nutrientes["Proteína"]?.valor || null,
    carboidratos: nutrientes["Carboidrato"]?.valor || null,
    gorduras: nutrientes["Lipídeos"]?.valor || null,
    fibras: nutrientes["Fibra alimentar"]?.valor || null,
    sodio: nutrientes["Sódio"]?.valor || null,
    todosNutrientes: nutrientes,
  };
};

export const clearSearchCache = () => {
  searchCache.clear();
};

export const getSearchStats = () => ({
  cacheSize: searchCache.size,
  dataLoaded: !!foodsDataCache,
  dataSize: foodsDataCache ? (foodsDataCache as any[]).length : 0,
});
