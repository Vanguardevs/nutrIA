# Implementação da Busca de Alimentos no Backend

## 📋 Resumo das Mudanças

O frontend foi simplificado para enviar apenas a pergunta do usuário para o backend. Agora o backend deve implementar a busca no `foods.json` e retornar respostas com dados nutricionais.

## 🔄 Mudanças no Frontend

### Antes (Busca Local)
- ❌ Carregava `foods.json` no frontend
- ❌ Fazia busca local com algoritmos de similaridade
- ❌ Processava dados nutricionais no cliente
- ❌ Enviava contexto nutricional para o backend

### Depois (Busca no Backend)
- ✅ Envia apenas a pergunta para o backend
- ✅ Backend faz toda a busca e processamento
- ✅ Resposta já vem formatada com dados nutricionais
- ✅ App mais leve e rápido

## 🚀 Implementação no Backend

### 1. Estrutura do Payload Recebido

```json
{
  "pergunta": "Quantas calorias tem uma maçã?",
  "id_user": "user123"
}
```

### 2. Função de Busca no Backend

```javascript
// Exemplo de implementação no backend
const fs = require('fs');
const path = require('path');

// Carrega o foods.json
const loadFoodsData = () => {
    try {
        const foodsPath = path.join(__dirname, 'data', 'foods.json');
        const foodsData = JSON.parse(fs.readFileSync(foodsPath, 'utf8'));
        return foodsData;
    } catch (error) {
        console.error('Erro ao carregar foods.json:', error);
        return [];
    }
};

// Função de busca inteligente
const searchFoods = (query, foodsData, options = {}) => {
    const {
        maxResults = 6,
        minSimilarity = 0.1,
        searchType = 'semantic'
    } = options;

    const queryLower = query.toLowerCase();
    const results = [];

    for (const food of foodsData) {
        let score = 0;
        
        // Busca por nome/descrição
        if (food.descricao && food.descricao.toLowerCase().includes(queryLower)) {
            score += 0.8;
        }
        
        // Busca por palavras-chave
        if (food.palavras_chave) {
            const keywords = food.palavras_chave.toLowerCase().split(',');
            for (const keyword of keywords) {
                if (keyword.trim().includes(queryLower)) {
                    score += 0.6;
                }
            }
        }
        
        // Busca por categoria
        if (food.categoria && food.categoria.toLowerCase().includes(queryLower)) {
            score += 0.4;
        }

        if (score >= minSimilarity) {
            results.push({
                ...food,
                relevanceScore: score
            });
        }
    }

    // Ordena por relevância e limita resultados
    return results
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, maxResults);
};

// Função para extrair informações nutricionais
const extractNutritionalInfo = (food) => {
    return {
        descricao: food.descricao,
        calorias: food.energia_kcal,
        proteinas: food.proteina_g,
        carboidratos: food.carboidrato_g,
        gorduras: food.lipideos_g,
        fibras: food.fibra_alimentar_g,
        categoria: food.categoria
    };
};
```

### 3. Endpoint Atualizado

```javascript
// Endpoint /question atualizado
app.post('/question', async (req, res) => {
    try {
        const { pergunta, id_user } = req.body;
        
        // Carrega dados de alimentos
        const foodsData = loadFoodsData();
        
        // Busca alimentos relevantes
        const alimentosEncontrados = searchFoods(pergunta, foodsData, {
            maxResults: 6,
            minSimilarity: 0.1
        });
        
        // Formata contexto nutricional
        let contextoNutricional = '';
        if (alimentosEncontrados.length > 0) {
            contextoNutricional = alimentosEncontrados.map(food => {
                const info = extractNutritionalInfo(food);
                return `- ${info.descricao}: ${info.calorias} kcal, ${info.proteinas}g proteínas, ${info.carboidratos}g carboidratos, ${info.gorduras}g gorduras`;
            }).join('\n');
        }
        
        // Instrução para a IA
        const systemPrompt = `Você é um assistente nutricional especializado. Use as informações nutricionais abaixo para responder à pergunta do usuário:

${contextoNutricional}

IMPORTANTE: Se a pergunta for sobre calorias, proteínas, carboidratos ou outros nutrientes, use os valores exatos fornecidos acima. Não diga que não tem acesso a dados nutricionais.`;

        // Chama a IA com o contexto nutricional
        const aiResponse = await callAI(pergunta, systemPrompt);
        
        res.json({
            message: {
                resposta: aiResponse
            }
        });
        
    } catch (error) {
        console.error('Erro no endpoint /question:', error);
        res.status(500).json({
            error: 'Erro interno do servidor'
        });
    }
});
```

## 📊 Benefícios da Mudança

### Performance
- ✅ App carrega mais rápido (não carrega foods.json)
- ✅ Menos uso de memória no dispositivo
- ✅ Menos processamento no cliente

### Segurança
- ✅ Dados nutricionais protegidos no servidor
- ✅ Controle de acesso centralizado
- ✅ Logs de uso no backend

### Manutenibilidade
- ✅ Atualizações de dados centralizadas
- ✅ Algoritmos de busca melhorados no servidor
- ✅ Cache inteligente no backend

## 🔧 Arquivos Necessários no Backend

1. **`foods.json`** - Base de dados nutricional
2. **`foodSearch.js`** - Funções de busca
3. **`nutritionalProcessor.js`** - Processamento de dados nutricionais
4. **Endpoint atualizado** - `/question` com busca integrada

## 📝 Próximos Passos

1. ✅ Frontend simplificado (concluído)
2. 🔄 Implementar busca no backend
3. 🔄 Testar funcionalidade
4. 🔄 Otimizar performance
5. 🔄 Implementar cache no backend

## 🎯 Resultado Esperado

Quando o usuário perguntar "Quantas calorias tem uma maçã?", o sistema deve:

1. Frontend envia pergunta para backend
2. Backend busca "maçã" no foods.json
3. Backend encontra dados nutricionais da maçã
4. Backend envia contexto para IA
5. IA responde com valores exatos de calorias
6. Frontend exibe resposta formatada 