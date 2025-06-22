import AsyncStorage from '@react-native-async-storage/async-storage';

// Cache para resultados de busca
let searchCache = new Map();
let foodsIndex = null;
let isLoadingIndex = false;

// Função para calcular similaridade entre strings
const calculateSimilarity = (str1, str2) => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
};

// Algoritmo de distância de Levenshtein otimizado
const levenshteinDistance = (str1, str2) => {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    
    return matrix[str2.length][str1.length];
};

// Função para criar índice de busca
const createSearchIndex = (foodsData) => {
    const index = {
        byName: new Map(),
        byCategory: new Map(),
        byNutrient: new Map(),
        keywords: new Map(),
        calorias: new Map() // Índice específico para calorias
    };
    
    foodsData.forEach((food, idx) => {
        const descricao = food.descricao || '';
        const descricaoNormalizada = descricao.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
        
        // Índice por nome
        const words = descricaoNormalizada.split(/\s+/);
        words.forEach(word => {
            if (word.length >= 2) {
                if (!index.byName.has(word)) {
                    index.byName.set(word, []);
                }
                index.byName.get(word).push(idx);
            }
        });
        
        // Índice por categoria (se existir)
        if (food.categoria) {
            const categoria = food.categoria.toLowerCase();
            if (!index.byCategory.has(categoria)) {
                index.byCategory.set(categoria, []);
            }
            index.byCategory.get(categoria).push(idx);
        }
        
        // Índice por nutrientes
        if (food.nutrientes) {
            food.nutrientes.forEach(nutriente => {
                const componente = nutriente.Componente?.toLowerCase();
                if (componente) {
                    if (!index.byNutrient.has(componente)) {
                        index.byNutrient.set(componente, []);
                    }
                    index.byNutrient.get(componente).push(idx);
                }
                
                // Índice específico para calorias
                if (componente === 'energia' && nutriente.Unidades === 'kcal') {
                    const valorCalorico = nutriente['Valor por 100g'];
                    if (valorCalorico) {
                        if (!index.calorias.has(valorCalorico)) {
                            index.calorias.set(valorCalorico, []);
                        }
                        index.calorias.get(valorCalorico).push(idx);
                    }
                }
            });
        }
        
        // Palavras-chave comuns
        const keywords = extractKeywords(descricao);
        keywords.forEach(keyword => {
            if (!index.keywords.has(keyword)) {
                index.keywords.set(keyword, []);
            }
            index.keywords.get(keyword).push(idx);
        });
    });
    
    return index;
};

// Função para extrair palavras-chave relevantes
const extractKeywords = (text) => {
    const keywords = [];
    const commonFoodWords = [
        'fruta', 'verdura', 'legume', 'carne', 'peixe', 'frango', 'arroz', 'feijao',
        'maca', 'banana', 'laranja', 'tomate', 'cenoura', 'batata', 'cebola',
        'alface', 'couve', 'brocolis', 'espinafre', 'pepino', 'abobora',
        'frango', 'boi', 'porco', 'peixe', 'camarao', 'salmão', 'atum',
        'leite', 'queijo', 'iogurte', 'manteiga', 'ovo', 'pao', 'bolo',
        'doce', 'chocolate', 'acucar', 'sal', 'azeite', 'oleo',
        'caloria', 'calorias', 'energia', 'proteina', 'carboidrato', 'gordura'
    ];
    
    const textLower = text.toLowerCase();
    commonFoodWords.forEach(word => {
        if (textLower.includes(word)) {
            keywords.push(word);
        }
    });
    
    return keywords;
};

// Função para buscar alimentos de forma inteligente
export const smartFoodSearch = async (query, options = {}) => {
    const {
        maxResults = 10,
        minSimilarity = 0.3,
        useCache = true,
        searchType = 'all'
    } = options;
    
    // Normaliza a query
    const normalizedQuery = query.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    
    if (normalizedQuery.length < 2) {
        return [];
    }
    
    // Verifica cache primeiro
    const cacheKey = `${normalizedQuery}_${searchType}_${maxResults}`;
    if (useCache && searchCache.has(cacheKey)) {
        console.log('Resultado encontrado no cache de busca');
        return searchCache.get(cacheKey);
    }
    
    // Carrega dados se necessário
    if (!foodsIndex) {
        await loadFoodsIndex();
    }
    
    if (!foodsIndex) {
        console.warn('Índice de alimentos não disponível');
        return [];
    }
    
    const results = [];
    const seenIndices = new Set();
    
    // Busca por diferentes estratégias
    const searchStrategies = [];
    
    if (searchType === 'all' || searchType === 'name') {
        searchStrategies.push(() => searchByName(normalizedQuery, foodsIndex));
    }
    
    if (searchType === 'all' || searchType === 'category') {
        searchStrategies.push(() => searchByCategory(normalizedQuery, foodsIndex));
    }
    
    if (searchType === 'all' || searchType === 'nutrient') {
        searchStrategies.push(() => searchByNutrient(normalizedQuery, foodsIndex));
    }
    
    // Busca específica por calorias
    if (normalizedQuery.includes('caloria') || normalizedQuery.includes('energia')) {
        searchStrategies.push(() => searchByCalories(normalizedQuery, foodsIndex));
    }
    
    // Executa todas as estratégias de busca
    for (const strategy of searchStrategies) {
        const strategyResults = strategy();
        strategyResults.forEach(({ index, score }) => {
            if (!seenIndices.has(index) && score >= minSimilarity) {
                seenIndices.add(index);
                results.push({ index, score });
            }
        });
    }
    
    // Ordena por relevância
    results.sort((a, b) => b.score - a.score);
    
    // Carrega os dados completos dos resultados
    const foodsData = await loadFoodsData();
    const finalResults = results.slice(0, maxResults).map(({ index, score }) => ({
        ...foodsData[index],
        relevanceScore: score
    }));
    
    // Salva no cache
    if (useCache && finalResults.length > 0) {
        searchCache.set(cacheKey, finalResults);
        
        // Limita o tamanho do cache
        if (searchCache.size > 100) {
            const firstKey = searchCache.keys().next().value;
            searchCache.delete(firstKey);
        }
    }
    
    console.log(`Busca inteligente: "${query}" retornou ${finalResults.length} resultados`);
    return finalResults;
};

// Busca por nome
const searchByName = (query, index) => {
    const results = [];
    const words = query.split(/\s+/);
    
    words.forEach(word => {
        if (word.length >= 2) {
            // Busca exata
            if (index.byName.has(word)) {
                index.byName.get(word).forEach(idx => {
                    results.push({ index: idx, score: 1.0 });
                });
            }
            
            // Busca por similaridade
            for (const [indexWord, indices] of index.byName) {
                const similarity = calculateSimilarity(word, indexWord);
                if (similarity >= 0.7) {
                    indices.forEach(idx => {
                        results.push({ index: idx, score: similarity });
                    });
                }
            }
        }
    });
    
    return results;
};

// Busca por categoria
const searchByCategory = (query, index) => {
    const results = [];
    
    for (const [category, indices] of index.byCategory) {
        const similarity = calculateSimilarity(query, category);
        if (similarity >= 0.5) {
            indices.forEach(idx => {
                results.push({ index: idx, score: similarity });
            });
        }
    }
    
    return results;
};

// Busca por nutriente
const searchByNutrient = (query, index) => {
    const results = [];
    
    for (const [nutrient, indices] of index.byNutrient) {
        const similarity = calculateSimilarity(query, nutrient);
        if (similarity >= 0.6) {
            indices.forEach(idx => {
                results.push({ index: idx, score: similarity });
            });
        }
    }
    
    return results;
};

// Busca específica por calorias
const searchByCalories = (query, index) => {
    const results = [];
    
    // Busca por alimentos com informações calóricas
    for (const [calorias, indices] of index.calorias) {
        indices.forEach(idx => {
            results.push({ index: idx, score: 0.9 }); // Alta relevância para calorias
        });
    }
    
    return results;
};

// Função para carregar o índice de busca
const loadFoodsIndex = async () => {
    if (isLoadingIndex) {
        while (isLoadingIndex) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return;
    }
    
    if (foodsIndex) {
        return foodsIndex;
    }
    
    isLoadingIndex = true;
    
    try {
        // Verifica se existe no cache
        const cachedIndex = await AsyncStorage.getItem('foods_search_index');
        if (cachedIndex) {
            const parsedIndex = JSON.parse(cachedIndex);
            foodsIndex = {
                byName: new Map(parsedIndex.byName),
                byCategory: new Map(parsedIndex.byCategory),
                byNutrient: new Map(parsedIndex.byNutrient),
                keywords: new Map(parsedIndex.keywords),
                calorias: new Map(parsedIndex.calorias || [])
            };
            console.log('Índice de busca carregado do cache');
            return foodsIndex;
        }
        
        // Cria novo índice
        console.log('Criando novo índice de busca...');
        const foodsData = await loadFoodsData();
        foodsIndex = createSearchIndex(foodsData);
        
        // Salva no cache
        const indexForStorage = {
            byName: Array.from(foodsIndex.byName.entries()),
            byCategory: Array.from(foodsIndex.byCategory.entries()),
            byNutrient: Array.from(foodsIndex.byNutrient.entries()),
            keywords: Array.from(foodsIndex.keywords.entries()),
            calorias: Array.from(foodsIndex.calorias.entries())
        };
        
        await AsyncStorage.setItem('foods_search_index', JSON.stringify(indexForStorage));
        console.log('Índice de busca criado e salvo');
        
    } catch (error) {
        console.error('Erro ao carregar índice de busca:', error);
        foodsIndex = null;
    } finally {
        isLoadingIndex = false;
    }
};

// Função para buscar sugestões para a IA (otimizada)
export const buscarSugestoesParaIA = async (texto, options = {}) => {
    if (!texto || texto.length < 2) return [];
    
    try {
        const resultados = await smartFoodSearch(texto, {
            maxResults: 6,
            minSimilarity: 0.2,
            useCache: true,
            searchType: 'all',
            ...options
        });
        
        return resultados;
    } catch (error) {
        console.error('Erro na busca de sugestões para IA:', error);
        return [];
    }
};

// Função para obter informações nutricionais completas de um alimento
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

// Função para limpar cache de busca
export const clearSearchCache = () => {
    searchCache.clear();
    console.log('Cache de busca limpo');
};

// Função para obter estatísticas de busca
export const getSearchStats = () => {
    return {
        cacheSize: searchCache.size,
        indexLoaded: !!foodsIndex,
        indexSize: foodsIndex ? {
            byName: foodsIndex.byName.size,
            byCategory: foodsIndex.byCategory.size,
            byNutrient: foodsIndex.byNutrient.size,
            keywords: foodsIndex.keywords.size,
            calorias: foodsIndex.calorias.size
        } : null
    };
};

// Importa a função loadFoodsData do arquivo original
import { loadFoodsData } from './foodsLoader.js'; 