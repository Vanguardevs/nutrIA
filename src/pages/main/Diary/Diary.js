
import React,{useState, useEffect} from 'react';
import { SafeAreaView ,View, Text, TouchableOpacity, StyleSheet, ImageBackground, Alert, useColorScheme, ScrollView } from 'react-native';
import CardCustomCalendar from '../../../components/CustomCardCalendar';
import { useNavigation } from '@react-navigation/native';
import {ref, onValue, getDatabase} from "firebase/database"
import {auth} from "../../../database/firebase";
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Notifications from 'expo-notifications';

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
  
  async function verificarTodasAgendas(){
    try{
      const userID = auth.currentUser?.uid;
      if(!userID){
        console.log("Usuário não encontrado")
        Alert.alert("Erro", "Não foi possível encontrar o usuário no banco. Tente Novamente!");
      }

      const db = getDatabase();

      const agenaRef = ref(db, `users/${userID}/diaries`);

      await onValue(agenaRef, (res)=>{
        const data = res.val();
        if(data){
          const listaAgendas = Object.entries(data).map(([key,value])=>({
            id: key,
            ...value,
          }));
          setAgendas(listaAgendas);
        }
        else{
          setAgendas([])
        }
      })

    }catch(e){
      console.log(e)
      
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
    const now = new Date();

    for (const agenda of agendas) {
      const hora = horaFormatada(agenda.hora);

      // Verificar se o horário está no futuro
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



  useEffect(()=>{
    verificarTodasAgendas()
    verificarNotificacao()
  },[])

  useEffect(() => {
    if (agendas.length > 0) {
      createNotification();
    }
  }, [agendas]);

  return (
    <ScrollView style={[styles.container,{backgroundColor: backgoundH}]} contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
      
      <ImageBackground source={require('../../../../assets/Frutas_home.png')} style={styles.homeBackground}>

        {agendas.map((agenda)=>(
          <CardCustomCalendar
          key={agenda.id}
          horario={agenda.hora}
          alimentacao={agenda.refeicao}
          onPressEdit={()=>{navigate.navigate("Edit-Diary", {id: agenda.id, refeicao: agenda.refeicao, hora: agenda.hora})}}
          />
        ))}

        <View style={{alignItems: 'center', marginTop:20}}>

          <TouchableOpacity style={styles.button} onPress={()=>{setConcluido(true); navigate.navigate("Create-Diary")}}>
            <Ionicons name="add-outline" size={20} color={backgoundIcons}/>
          </TouchableOpacity>

        </View>

        <View/>
      </ImageBackground>
    </ScrollView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  homeBackground: {
    flex: 1,
    justifyContent: 'align-center',
    alignItems: 'center',
    height: '120%',
    width: '100%',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 50, 
    height: 70,
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'static',  
    bottom: 110,
    right: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 40, 
    fontWeight: 'bold', 
    textAlign: 'center',
  },
});