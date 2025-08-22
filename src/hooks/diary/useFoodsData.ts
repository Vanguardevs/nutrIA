import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { loadFoodsData } from "src/utils/foodsLoader";

export function useFoodsData() {
  const [alimentos, setAlimentos] = useState<any[]>([]);
  const [isLoadingFoods, setIsLoadingFoods] = useState<boolean>(true);

  useEffect(() => {
    const loadFoods = async () => {
      try {
        setIsLoadingFoods(true);
        try {
          const foodsData = await loadFoodsData();
          setAlimentos(foodsData as any[]);
        } catch (cacheError) {
          console.warn("Cache de alimentos falhou, usando require como fallback:", cacheError);
          const foodsData: any[] = require("src/pages/main/foods.json");
          setAlimentos(foodsData);
        }
      } catch (e) {
        console.error("Erro ao carregar foods.json", e);
        Alert.alert("Erro", "Não foi possível carregar a base de dados de alimentos.");
        setAlimentos([]);
      } finally {
        setIsLoadingFoods(false);
      }
    };
    loadFoods();
  }, []);

  return { alimentos, isLoadingFoods };
}