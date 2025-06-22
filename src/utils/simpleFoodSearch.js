import { loadFoodsData } from './foodsLoader';

// Cache simples para resultados de busca
let searchCache = new Map();
let foodsDataCache = null;

// Função para normalizar texto
const normalizeText = (text) => {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
};

// Função para calcular similaridade simples
const calculateSimilarity = (query, text) => {
    const queryWords = query.split(/\s+/);
    const textWords = text.split(/\s+/);
    
    let matches = 0;
    queryWords.forEach(queryWord => {
        textWords.forEach(textWord => {
            if (textWord.includes(queryWord) || queryWord.includes(textWord)) {
                matches++;
            }
        });
    });
    
    return matches / Math.max(queryWords.length, textWords.length);
};

// Função para buscar alimentos de forma simples e eficiente
export const simpleFoodSearch = async (query, options = {}) => {
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
    
    // Verifica cache primeiro
    const cacheKey = `${normalizedQuery}_${maxResults}`;
    if (useCache && searchCache.has(cacheKey)) {
        console.log('Resultado encontrado no cache de busca');
        return searchCache.get(cacheKey);
    }
    
    try {
        // Carrega dados se necessário
        if (!foodsDataCache) {
            console.log('Carregando dados de alimentos...');
            foodsDataCache = await loadFoodsData();
            console.log(`Dados carregados: ${foodsDataCache.length} alimentos`);
        }
        
        const results = [];
        
        // Busca por similaridade
        foodsDataCache.forEach((food, index) => {
            const descricao = food.descricao || '';
            const descricaoNormalizada = normalizeText(descricao);
            
            // Calcula similaridade
            const similarity = calculateSimilarity(normalizedQuery, descricaoNormalizada);
            
            // Busca por palavras-chave específicas
            let keywordBonus = 0;
            const keywords = ['caloria', 'energia', 'proteina', 'carboidrato', 'gordura'];
            keywords.forEach(keyword => {
                if (normalizedQuery.includes(keyword)) {
                    keywordBonus += 0.2;
                }
            });
            
            const finalScore = similarity + keywordBonus;
            
            if (finalScore >= minSimilarity) {
                results.push({
                    ...food,
                    relevanceScore: finalScore,
                    originalIndex: index
                });
            }
        });
        
        // Ordena por relevância
        results.sort((a, b) => b.relevanceScore - a.relevanceScore);
        
        // Limita resultados
        const finalResults = results.slice(0, maxResults);
        
        // Salva no cache
        if (useCache && finalResults.length > 0) {
            searchCache.set(cacheKey, finalResults);
            
            // Limita o tamanho do cache
            if (searchCache.size > 50) {
                const firstKey = searchCache.keys().next().value;
                searchCache.delete(firstKey);
            }
        }
        
        console.log(`Busca simples: "${query}" retornou ${finalResults.length} resultados`);
        return finalResults;
        
    } catch (error) {
        console.error('Erro na busca simples:', error);
        return [];
    }
};

// Função para buscar sugestões para a IA
export const buscarSugestoesParaIA = async (texto, options = {}) => {
    if (!texto || texto.length < 2) return [];
    
    try {
        const resultados = await simpleFoodSearch(texto, {
            maxResults: 6,
            minSimilarity: 0.1,
            useCache: true,
            ...options
        });
        
        return resultados;
    } catch (error) {
        console.error('Erro na busca de sugestões para IA:', error);
        return [];
    }
};

// Função para obter informações nutricionais completas de um alimento - versão melhorada
export const getNutritionalInfo = (alimento) => {
    if (!alimento) {
        console.log('❌ Alimento é null ou undefined');
        return null;
    }
    
    if (!alimento.nutrientes || !Array.isArray(alimento.nutrientes)) {
        console.log('❌ Alimento não tem nutrientes ou nutrientes não é array:', alimento.descricao);
        return null;
    }
    
    console.log(`🔍 Processando nutrientes para: ${alimento.descricao}`);
    console.log(`   Número de nutrientes: ${alimento.nutrientes.length}`);
    
    const nutrientes = {};
    
    alimento.nutrientes.forEach((nutriente, index) => {
        const componente = nutriente.Componente;
        const valor = nutriente['Valor por 100g'];
        const unidades = nutriente.Unidades;
        
        console.log(`   Nutriente ${index + 1}: ${componente} = ${valor} ${unidades}`);
        
        if (componente && valor !== undefined) {
            nutrientes[componente] = {
                valor: valor,
                unidades: unidades
            };
        }
    });
    
    const result = {
        descricao: alimento.descricao,
        calorias: nutrientes['Energia']?.valor || null,
        proteinas: nutrientes['Proteína']?.valor || null,
        carboidratos: nutrientes['Carboidrato']?.valor || null,
        gorduras: nutrientes['Lipídeos']?.valor || null,
        fibras: nutrientes['Fibra alimentar']?.valor || null,
        sodio: nutrientes['Sódio']?.valor || null,
        todosNutrientes: nutrientes
    };
    
    console.log('✅ Informações nutricionais extraídas:', result);
    return result;
};

// Função para limpar cache
export const clearSearchCache = () => {
    searchCache.clear();
    console.log('Cache de busca limpo');
};

// Função para obter estatísticas
export const getSearchStats = () => {
    return {
        cacheSize: searchCache.size,
        dataLoaded: !!foodsDataCache,
        dataSize: foodsDataCache ? foodsDataCache.length : 0
    };
}; 