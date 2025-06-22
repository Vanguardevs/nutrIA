// Função para testar a extração de dados nutricionais
export const testNutritionalExtraction = async () => {
    try {
        console.log('🧪 Testando extração de dados nutricionais...');
        
        // Importa as funções necessárias
        const { loadFoodsData } = await import('./foodsLoader');
        const { getNutritionalInfo } = await import('./simpleFoodSearch');
        
        // Carrega alguns dados de exemplo
        const foodsData = await loadFoodsData();
        
        if (foodsData.length === 0) {
            console.log('❌ Nenhum dado de alimento encontrado');
            return;
        }
        
        console.log(`�� Total de alimentos carregados: ${foodsData.length}`);
        
        // Testa com os primeiros 5 alimentos
        const testFoods = foodsData.slice(0, 5);
        
        testFoods.forEach((food, index) => {
            console.log(`\n🍎 Testando alimento ${index + 1}: ${food.descricao}`);
            
            // Verifica se tem nutrientes
            if (!food.nutrientes) {
                console.log('   ❌ Sem dados de nutrientes');
                return;
            }
            
            console.log(`   📋 Número de nutrientes: ${food.nutrientes.length}`);
            
            // Mostra alguns nutrientes de exemplo
            food.nutrientes.slice(0, 3).forEach(nutriente => {
                console.log(`   - ${nutriente.Componente}: ${nutriente['Valor por 100g']} ${nutriente.Unidades}`);
            });
            
            // Testa a função de extração
            const info = getNutritionalInfo(food);
            console.log('   🔍 Informações extraídas:', info);
        });
        
        // Testa busca específica por maçã
        console.log('\n�� Testando busca por "maçã"...');
        const { buscarSugestoesParaIA } = await import('./simpleFoodSearch');
        
        const resultados = await buscarSugestoesParaIA('maçã', {
            maxResults: 3,
            minSimilarity: 0.1
        });
        
        console.log(`   Resultados encontrados: ${resultados.length}`);
        resultados.forEach((item, index) => {
            const info = getNutritionalInfo(item);
            console.log(`   ${index + 1}. ${item.descricao}`);
            console.log(`      Calorias: ${info?.calorias || 'N/A'} kcal`);
            console.log(`      Proteínas: ${info?.proteinas || 'N/A'} g`);
        });
        
        console.log('\n✅ Teste concluído!');
        
    } catch (error) {
        console.error('❌ Erro no teste:', error);
    }
};

// Função para verificar estrutura dos dados
export const checkDataStructure = async () => {
    try {
        console.log('🔍 Verificando estrutura dos dados...');
        
        const { loadFoodsData } = await import('./foodsLoader');
        const foodsData = await loadFoodsData();
        
        if (foodsData.length === 0) {
            console.log('❌ Nenhum dado encontrado');
            return;
        }
        
        const sampleFood = foodsData[0];
        console.log('📋 Estrutura de exemplo:');
        console.log('   Descrição:', sampleFood.descricao);
        console.log('   Tem nutrientes:', !!sampleFood.nutrientes);
        console.log('   Número de nutrientes:', sampleFood.nutrientes?.length || 0);
        
        if (sampleFood.nutrientes && sampleFood.nutrientes.length > 0) {
            const sampleNutrient = sampleFood.nutrientes[0];
            console.log('   Exemplo de nutriente:');
            console.log('     Componente:', sampleNutrient.Componente);
            console.log('     Valor por 100g:', sampleNutrient['Valor por 100g']);
            console.log('     Unidades:', sampleNutrient.Unidades);
        }
        
        // Verifica se há alimentos com energia/calorias
        const alimentosComEnergia = foodsData.filter(food => 
            food.nutrientes?.some(n => n.Componente === 'Energia')
        );
        
        console.log(`\n🔥 Alimentos com dados de energia: ${alimentosComEnergia.length}`);
        
        if (alimentosComEnergia.length > 0) {
            const exemplo = alimentosComEnergia[0];
            const energia = exemplo.nutrientes.find(n => n.Componente === 'Energia');
            console.log(`   Exemplo: ${exemplo.descricao} - ${energia['Valor por 100g']} ${energia.Unidades}`);
        }
        
    } catch (error) {
        console.error('❌ Erro na verificação:', error);
    }
}; 