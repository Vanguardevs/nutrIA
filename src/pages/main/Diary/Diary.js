import React,{useState, useEffect, useRef} from 'react';
import { SafeAreaView ,View, Text, TouchableOpacity, StyleSheet, ImageBackground, Alert, useColorScheme, ScrollView, Dimensions } from 'react-native';
import CardCustomCalendar from '../../../components/CustomCardCalendar';
import { useNavigation } from '@react-navigation/native';
import {ref, onValue, getDatabase, push, update, off} from "firebase/database"
import {auth} from "../../../database/firebase";
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Notifications from 'expo-notifications';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const TAB_BAR_HEIGHT = Math.round(SCREEN_HEIGHT * 0.08); // 8% da tela, igual ao appRoute.js

export default function Diary() {

  Notifications.setNotificationHandler({
    handleNotification: async()=>({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false
    })
  })

  const colorSheme = useColorScheme();

  const backgoundH = colorSheme === 'dark'? "#1C1C1E" : "#F2F2F2"
  const backgoundIcons = colorSheme === 'dark'? "#F2F2F2" : "#1C1C1E"

  const navigate = useNavigation();

  const [agendas, setAgendas] = useState([])
  const [concluido, setConcluido] = useState(false);
  
  // Ref para controlar a inscrição do Firebase
  const unsubscribeRef = useRef(null);
  const lastAgendasData = useRef(null); // Para detectar mudanças

  async function verificarTodasAgendas(){

    try{
      const userID = auth.currentUser?.uid;
      if(!userID){
        console.log("Usuário não encontrado")
        Alert.alert("Erro", "Não foi possível encontrar o usuário no banco. Tente Novamente!");
        return;
      }

      const db = getDatabase();
      const agenaRef = ref(db, `users/${userID}/diaries`);

      // Remove inscrição anterior se existir
      if (unsubscribeRef.current) {
        console.log('[DIARY] Removendo inscrição anterior do Firebase');
        off(agenaRef, 'value', unsubscribeRef.current);
        unsubscribeRef.current = null;
      }

      // Cria nova inscrição
      console.log('[DIARY] Criando nova inscrição no Firebase');
      const unsubscribe = onValue(agenaRef, (res)=>{
        const data = res.val();
        console.log('[DIARY] Dados recebidos do Firebase:', data ? Object.keys(data).length : 0, 'agendas');
        
        if(data){
          const listaAgendas = Object.entries(data).map(([key,value])=>({
            id: key,
            ...value,
          }));

          console.log('[DIARY] Lista completa de agendas:', listaAgendas.map(a => ({
            id: a.id,
            refeicao: a.refeicao,
            horario: a.horario,
            saveId: a.saveId,
            debugTimestamp: a.debugTimestamp
          })));

          const hoje = new Date().getDay();

          const agendasHoje = listaAgendas.filter(agenda =>{
            return agenda.progress[hoje] === false;
          })

          console.log('[DIARY] Agendas para hoje:', agendasHoje.length, 'agendas');
          console.log('[DIARY] Detalhes das agendas de hoje:', agendasHoje.map(a => ({
            id: a.id,
            refeicao: a.refeicao,
            horario: a.horario,
            saveId: a.saveId,
            debugTimestamp: a.debugTimestamp
          })));

          // Verifica se os dados realmente mudaram
          const currentData = JSON.stringify(agendasHoje);
          if (lastAgendasData.current !== currentData) {
            console.log('[DIARY] Dados mudaram, atualizando estado...');
            lastAgendasData.current = currentData;
            setAgendas(agendasHoje);
          } else {
            console.log('[DIARY] Dados não mudaram, ignorando atualização');
          }
        }
        else{
          console.log('[DIARY] Nenhuma agenda encontrada');
          setAgendas([])
        }
      }, (error) => {
        console.error('[DIARY] Erro ao carregar agendas:', error);
      });

      // Salva a referência para limpeza posterior
      unsubscribeRef.current = unsubscribe;

    }catch(e){
      console.log('[DIARY] Erro em verificarTodasAgendas:', e)
    }
  }

  async function verificarNotificacao() {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        "Permissão de notificação",
        "Para receber notificações, ative as permissões de notificação nas configurações do aplicativo."
      );
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== 'granted') {
        console.log("Permissões de notificação não concedidas.");
        return;
      }
    }
  }

  function horaFormatada(hora) {
    const [horas, minutos] = hora.split(':').map((item) => parseInt(item, 10));
    if (isNaN(horas) || isNaN(minutos)) {
      console.error("Formato de hora inválido:", hora);
      return null;
    }
    return { horas, minutos };
  }

  async function createNotification() {
    for (const agenda of agendas) {
      
      // Verifica se existe 'horario' ou 'hora' e usa o que estiver disponível
      const horarioValue = agenda.horario || agenda.hora;
      
      if (!horarioValue) {
          console.error("Propriedade 'horario' ou 'hora' não existe no objeto agenda:", agenda);
          continue;
      }

      const hora = horaFormatada(horarioValue);
      if (!hora) {
          console.error("Erro ao formatar o horário:", horarioValue);
          continue;
      }

      const now = new Date();
      const triggerDate = new Date();
      triggerDate.setHours(hora.horas);
      triggerDate.setMinutes(hora.minutos);
      triggerDate.setSeconds(0);

      if (triggerDate <= now) {
          triggerDate.setDate(triggerDate.getDate() + 1);
      }

      await Notifications.scheduleNotificationAsync({
          content: {
              title: `Hora de se alimentar! (${agenda.refeicao})`,
              body: "Este é o horário de se alimentar de " + agenda.refeicao,
              data: { data: 'goes here' },
          },
          trigger: {
              date: triggerDate,
          },
      });
    }
  }

  async function AgendaConcluida(id){
    const userID = auth.currentUser?.uid;
    const db = getDatabase();
    const data = new Date();
    const dia = data.getDay()

    const reference = ref(db, `users/${userID}/diaries/${id}/progress/`);
    update(reference,{
      [dia]: true
    })
  }

  // Cleanup function para limpar inscrições
  const cleanup = () => {
    if (unsubscribeRef.current) {
      const db = getDatabase();
      const userID = auth.currentUser?.uid;
      if (userID) {
        const agenaRef = ref(db, `users/${userID}/diaries`);
        off(agenaRef, 'value', unsubscribeRef.current);
        unsubscribeRef.current = null;
      }
    }
  };

  useEffect(()=>{
    console.log('[DIARY] Componente montado, iniciando...');
    verificarTodasAgendas()
    verificarNotificacao()
    
    // Cleanup quando o componente for desmontado
    return cleanup;
  },[])

  useEffect(() => {
    if (agendas.length > 0) {
      createNotification();
    }
  }, [agendas]);

  // Log quando agendas mudam
  useEffect(() => {
    console.log('[DIARY] Estado de agendas mudou:', agendas.length, 'agendas');
  }, [agendas]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: backgoundH }]}>
      <ImageBackground 
        source={require('../../../../assets/Frutas_home.png')} 
        style={styles.homeBackground}
        resizeMode="cover"
      >
        {/* Botão de criar agenda dentro do plano de fundo */}
        <View style={styles.fabTopContainer}>
          <TouchableOpacity
            style={styles.fabTop}
            onPress={() => navigate.navigate('CreateDiary')}
          >
            <Ionicons name="add" size={32} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Container principal com ScrollView */}
        <View style={styles.contentContainer}>
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingBottom: TAB_BAR_HEIGHT + 16,
                minHeight: agendas.length === 0 ? SCREEN_HEIGHT * 0.7 : undefined
              }
            ]}
            showsVerticalScrollIndicator={false}
          >
            {agendas.length > 0 ? (
              agendas.map((agenda) => (
                <CardCustomCalendar
                  key={agenda.id}
                  horario={agenda.horario || agenda.hora}
                  alimentacao={agenda.refeicao}
                  onPressEdit={() => {
                    navigate.navigate("EditDiary", {
                      id: agenda.id, 
                      refeicao: agenda.refeicao, 
                      hora: agenda.horario || agenda.hora
                    })
                  }}
                  onPressConcluido={() => AgendaConcluida(agenda.id)}
                />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="calendar-outline" size={64} color="#C7C7CC" />
                <Text style={styles.emptyText}>Nenhuma agenda para hoje</Text>
                <Text style={styles.emptySubText}>
                  Crie uma nova agenda para começar
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  homeBackground: {
    flex: 1,
    width: '100%',
  },
  fabTopContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
  },
  fabTop: {
    backgroundColor: '#2E8331',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: 100,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#8E8E93',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 16,
    color: '#C7C7CC',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
});