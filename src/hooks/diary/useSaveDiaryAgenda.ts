import { useState, useRef, useCallback } from "react";
import { Alert } from "react-native";
import { getDatabase, ref, push } from "firebase/database";
import { auth } from "src/database/firebase";

export function useSaveDiaryAgenda() {
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const isSavingRef = useRef(false);
  const lastSaveTime = useRef(0);
  const saveInProgress = useRef(false);
  const saveCount = useRef(0);

  const saveAgenda = useCallback(
    async (
      alimentosAgenda: string[],
      hora: string,
      tipoRefeicao: string,
      showSuccessModal: (data: any) => void
    ) => {
      const saveId = ++saveCount.current;
      const now = Date.now();

      if (saveInProgress.current) return;
      if (now - lastSaveTime.current < 3000) return;
      if (alimentosAgenda.length === 0 || hora === "" || tipoRefeicao === "") {
        Alert.alert("Tente novamente", "Alguns dos campos de cadastro estão vazios");
        return;
      }

      lastSaveTime.current = now;
      saveInProgress.current = true;
      isSavingRef.current = true;
      setIsSaving(true);
      setLoading(true);

      try {
        const db = getDatabase();
        const userId = auth.currentUser?.uid;
        if (!userId) throw new Error("Usuário não autenticado");
        const diariesRef = ref(db, `users/${userId}/diaries`);

        const pushResult = await push(diariesRef, {
          tipo_refeicao: tipoRefeicao,
          alimentos: alimentosAgenda,
          hora: hora,
          progress: [false, false, false, false, false, false, false],
          createdAt: new Date().toISOString(),
          saveId: saveId,
          debugTimestamp: Date.now(),
        });

        showSuccessModal({
          tipoRefeicao,
          alimentos: alimentosAgenda,
          horario: hora,
          id: pushResult.key,
        });
      } catch (error) {
        Alert.alert("Erro", "Erro ao cadastrar a agenda no banco de dados");
      } finally {
        setLoading(false);
        setIsSaving(false);
        isSavingRef.current = false;
        saveInProgress.current = false;
      }
    },
    []
  );

  return { saveAgenda, loading, isSaving };
}