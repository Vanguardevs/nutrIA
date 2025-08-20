
import { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { ref, onValue, getDatabase, off } from 'firebase/database';
import { auth } from '../../database/firebase.js';

export function useDiaryAgendas() {
  const [agendas, setAgendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const unsubscribeRef = useRef(null);
  const lastAgendasData = useRef(null);

  useEffect(() => {
    const userID = auth.currentUser?.uid;
    if (!userID) {
      setError('Usuário não encontrado');
      Alert.alert('Erro', 'Não foi possível encontrar o usuário no banco. Tente Novamente!');
      setLoading(false);
      return;
    }

    const db = getDatabase();
    const agenaRef = ref(db, `users/${userID}/diaries`);

    if (unsubscribeRef.current) {
      off(agenaRef, 'value', unsubscribeRef.current);
      unsubscribeRef.current = null;
    }

    const unsubscribe = onValue(
      agenaRef,
      (res) => {
        const data = res.val();
        if (data) {
          const listaAgendas = Object.entries(data).map(([key, value]) => ({
            id: key,
            ...value,
          }));
          const hoje = new Date().getDay();
          const agendasHoje = listaAgendas.filter((agenda) => agenda.progress[hoje] === false);
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
      (error) => {
        setError(error.message);
        setLoading(false);
      }
    );

    unsubscribeRef.current = unsubscribe;

    return () => {
      if (unsubscribeRef.current) {
        off(agenaRef, 'value', unsubscribeRef.current);
        unsubscribeRef.current = null;
      }
    };
  }, []);

  return { agendas, loading, error };
}