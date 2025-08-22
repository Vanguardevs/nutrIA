import { useState, useCallback } from "react";

export function useDiaryFoods(alimentos: any[], initialFoods: any[]) {
  const [alimentosAgenda, setAlimentosAgenda] = useState<string[]>(
    Array.isArray(initialFoods)
      ? initialFoods.map((a: any) => (typeof a === "object" ? a.nome || a.descricao || String(a) : String(a)))
      : []
  );
  const [alimentoInput, setAlimentoInput] = useState("");
  const [sugestoes, setSugestoes] = useState<any[]>([]);
  const [showAll, setShowAll] = useState(false);

  const filtrarSugestoes = useCallback(
    (texto: string) => {
      setAlimentoInput(texto);
      if (texto.length < 2) {
        setSugestoes([]);
        return;
      }
      const textoNormalizado = texto.normalize("NFD").replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase();
      const filtrados = alimentos
        .filter((item: any) => item.descricaoNormalizada?.includes(textoNormalizado))
        .slice(0, 6);
      setSugestoes(filtrados);
    },
    [alimentos]
  );

  const adicionarAlimento = useCallback(() => {
    const valor = alimentoInput.trim();
    if (valor && !alimentosAgenda.includes(valor)) {
      setAlimentosAgenda((prev) => [...prev, valor]);
      setAlimentoInput("");
      setSugestoes([]);
    }
  }, [alimentoInput, alimentosAgenda]);

  const removerAlimento = useCallback((alimento: string) => {
    setAlimentosAgenda((prev) => prev.filter((a) => a !== alimento));
  }, []);

  return {
    alimentosAgenda,
    alimentoInput,
    sugestoes,
    showAll,
    setShowAll,
    filtrarSugestoes,
    adicionarAlimento,
    removerAlimento,
  };
}
