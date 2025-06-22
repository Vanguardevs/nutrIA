import { loadFoodsData } from './foodsLoader';

// Cache simples
let searchCache = new Map();
let foodsDataCache = null;

// Função para normalizar texto
const normalizeText = (text) => {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
};

// Função para buscar alimentos básica
export const basicFoodSearch = async (query, options = {}) => {
    const {
        maxResults = 6,
        minSimilarity = 0.1,
        useCache = true
    } = options;
    
    // Normaliza a query
    const normalizedQuery = normalizeText(query);
    
    if (normalizedQuery.length < 2) {
        return [];
    }
    
    // Verifica cache
    const cacheKey = `${normalizedQuery}_${maxResults}`;
    if (useCache && searchCache.has(cacheKey)) {
        return searchCache.get(cacheKey);
    }
    
    try {
        // Carrega dados se necessário
        if (!foodsDataCache) {
            foodsDataCache = await loadFoodsData();
        }
        
        const results = [];
        
        // Busca simples por inclusão de texto
        foodsDataCache.forEach((food, index) => {
            const descricao = food.descricao || '';
            const descricaoNormalizada = normalizeText(descricao);
            
            // Verifica se a query está contida na descrição
            if (descricaoNormalizada.includes(normalizedQuery)) {
                results.push({
                    ...food,
                    relevanceScore: 1.0,
                    originalIndex: index
                });
            }
            // Verifica se alguma palavra da query está na descrição
            else {
                const queryWords = normalizedQuery.split(/\s+/);
                let matches = 0;
                
                queryWords.forEach(word => {
                    if (descricaoNormalizada.includes(word)) {
                        matches++;
                    }
                });
                
                if (matches > 0) {
                    const score = matches / queryWords.length;
                    if (score >= minSimilarity) {
                        results.push({
                            ...food,
                            relevanceScore: score,
                            originalIndex: index
                        });
                    }
                }
            }
        });
        
        // Ordena por relevância
        results.sort((a, b) => b.relevanceScore - a.relevanceScore);
        
        // Limita resultados
        const finalResults = results.slice(0, maxResults);
        
        // Salva no cache
        if (useCache && finalResults.length > 0) {
            searchCache.set(cacheKey, finalResults);
            
            // Limita cache
            if (searchCache.size > 50) {
                const firstKey = searchCache.keys().next().value;
                searchCache.delete(firstKey);
            }
        }
        
        return finalResults;
        
    } catch (error) {
        console.error('Erro na busca básica:', error);
        return [];
    }
};

// Função para buscar sugestões para a IA
export const buscarSugestoesParaIA = async (texto, options = {}) => {
    if (!texto || texto.length < 2) return [];
    
    try {
        return await basicFoodSearch(texto, {
            maxResults: 6,
            minSimilarity: 0.1,
            useCache: true,
            ...options
        });
    } catch (error) {
        console.error('Erro na busca de sugestões para IA:', error);
        return [];
    }
};

// Função para obter informações nutricionais
export const getNutritionalInfo = (alimento) => {
    if (!alimento || !alimento.nutrientes) {
        return null;
    }
    
    const nutrientes = {};
    
    alimento.nutrientes.forEach(nutriente => {
        const componente = nutriente.Componente;
        const valor = nutriente['Valor por 100g'];
        const unidades = nutriente.Unidades;
        
        if (componente && valor !== undefined) {
            nutrientes[componente] = {
                valor: valor,
                unidades: unidades
            };
        }
    });
    
    return {
        descricao: alimento.descricao,
        calorias: nutrientes['Energia']?.valor || null,
        proteinas: nutrientes['Proteína']?.valor || null,
        carboidratos: nutrientes['Carboidrato']?.valor || null,
        gorduras: nutrientes['Lipídeos']?.valor || null,
        fibras: nutrientes['Fibra alimentar']?.valor || null,
        sodio: nutrientes['Sódio']?.valor || null,
        todosNutrientes: nutrientes
    };
};

// Função para limpar cache
export const clearSearchCache = () => {
    searchCache.clear();
};

// Função para obter estatísticas
export const getSearchStats = () => {
    return {
        cacheSize: searchCache.size,
        dataLoaded: !!foodsDataCache,
        dataSize: foodsDataCache ? foodsDataCache.length : 0
    };
}; 