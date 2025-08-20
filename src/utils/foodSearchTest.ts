// Função para testar a extração de dados nutricionais
import { loadFoodsData } from "src/utils/foodsLoader";
import { getNutritionalInfo, buscarSugestoesParaIA } from "src/utils/simpleFoodSearch";

export const testNutritionalExtraction = async () => {
  try {
    console.log("🧪 Testando extração de dados nutricionais...");

    const foodsData: any[] = await loadFoodsData();
    if (foodsData.length === 0) {
      console.log("❌ Nenhum dado de alimento encontrado");
      return;
    }

    console.log(`📦 Total de alimentos carregados: ${foodsData.length}`);

    const testFoods = foodsData.slice(0, 5);

    testFoods.forEach((food, index) => {
      console.log(`\n🍎 Testando alimento ${index + 1}: ${food.descricao}`);

      if (!food.nutrientes) {
        console.log("   ❌ Sem dados de nutrientes");
        return;
      }

      console.log(`   📋 Número de nutrientes: ${food.nutrientes.length}`);

      food.nutrientes.slice(0, 3).forEach((nutriente: any) => {
        console.log(`   - ${nutriente.Componente}: ${nutriente["Valor por 100g"]} ${nutriente.Unidades}`);
      });

      const info = getNutritionalInfo(food as any);
      console.log("   🔍 Informações extraídas:", info);
    });

    // Testa busca específica por maçã
    console.log('\n🔎 Testando busca por "maçã"...');
    const resultados = await buscarSugestoesParaIA("maçã", { maxResults: 3, minSimilarity: 0.1 });
    console.log(`   Resultados encontrados: ${resultados.length}`);
    resultados.forEach((item: any, index: number) => {
      const info = getNutritionalInfo(item);
      console.log(`   ${index + 1}. ${item.descricao}`);
      console.log(`      Calorias: ${info?.calorias || "N/A"} kcal`);
      console.log(`      Proteínas: ${info?.proteinas || "N/A"} g`);
    });

    console.log("\n✅ Teste concluído!");
  } catch (error) {
    console.error("❌ Erro no teste:", error);
  }
};

export const checkDataStructure = async () => {
  try {
    console.log("🔍 Verificando estrutura dos dados...");
    const foodsData: any[] = await loadFoodsData();

    if (foodsData.length === 0) {
      console.log("❌ Nenhum dado encontrado");
      return;
    }

    const sampleFood = foodsData[0];
    console.log("📋 Estrutura de exemplo:");
    console.log("   Descrição:", sampleFood.descricao);
    console.log("   Tem nutrientes:", !!sampleFood.nutrientes);
    console.log("   Número de nutrientes:", sampleFood.nutrientes?.length || 0);

    if (sampleFood.nutrientes && sampleFood.nutrientes.length > 0) {
      const sampleNutrient = sampleFood.nutrientes[0];
      console.log("   Exemplo de nutriente:");
      console.log("     Componente:", sampleNutrient.Componente);
      console.log("     Valor por 100g:", sampleNutrient["Valor por 100g"]);
      console.log("     Unidades:", sampleNutrient.Unidades);
    }

    const alimentosComEnergia = foodsData.filter((food: any) =>
      food.nutrientes?.some((n: any) => n.Componente === "Energia"),
    );
    console.log(`\n🔥 Alimentos com dados de energia: ${alimentosComEnergia.length}`);

    if (alimentosComEnergia.length > 0) {
      const exemplo = alimentosComEnergia[0];
      const energia = exemplo.nutrientes.find((n: any) => n.Componente === "Energia");
      console.log(`   Exemplo: ${exemplo.descricao} - ${energia["Valor por 100g"]} ${energia.Unidades}`);
    }
  } catch (error) {
    console.error("❌ Erro na verificação:", error);
  }
};
