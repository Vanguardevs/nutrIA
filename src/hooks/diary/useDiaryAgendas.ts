import { useState, useEffect, useRef } from "react";
import { Alert } from "react-native";
import { ref, onValue, getDatabase, type DataSnapshot } from "firebase/database";
import { auth } from "src/database/firebase";

export type DiaryAgenda = {
  id: string;
  horario?: string; // e.g., "08:30"
  hora?: string; // sometimes agenda uses this field
  refeicao?: string;
  tipo_refeicao?: string;
  progress?: boolean[] | Record<number | string, boolean>;
  // allow additional backend fields
  [key: string]: any;
};

type UseDiaryAgendasReturn = {
  agendas: DiaryAgenda[];
  loading: boolean;
  error: string | null;
};

export function useDiaryAgendas(): UseDiaryAgendasReturn {
  const [agendas, setAgendas] = useState<DiaryAgenda[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const unsubscribeRef = useRef<null | (() => void)>(null);
  const lastAgendasData = useRef<string | null>(null);

  useEffect(() => {
    const userID = auth.currentUser?.uid;
    if (!userID) {
      setError("Usuário não encontrado");
      Alert.alert("Erro", "Não foi possível encontrar o usuário no banco. Tente Novamente!");
      setLoading(false);
      return;
    }

    const db = getDatabase();
    const agenaRef = ref(db, `users/${userID}/diaries`);

    // Ensure previous subscription is cleaned up before creating a new one
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    const unsubscribe = onValue(
      agenaRef,
      (res: DataSnapshot) => {
        const data = res.val() as Record<string, any> | null;
        if (data) {
          const listaAgendas: DiaryAgenda[] = Object.entries(data).map(([key, value]) => ({
            id: key,
            ...(value as object),
          }));
          const hoje = new Date().getDay();
          const agendasHoje = listaAgendas.filter((agenda) => (agenda as any).progress?.[hoje] === false);
          const currentData = JSON.stringify(agendasHoje);
          if (lastAgendasData.current !== currentData) {
            lastAgendasData.current = currentData;
            setAgendas(agendasHoje);
          }
        } else {
          setAgendas([]);
        }
        setLoading(false);
      },
      (err: any) => {
        setError(err?.message ?? "Erro ao carregar agendas");
        setLoading(false);
      },
    );

    unsubscribeRef.current = unsubscribe;

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, []);

  return { agendas, loading, error };
}
