import React,{useState, useEffect} from 'react';
import { SafeAreaView ,View, Text, TouchableOpacity, StyleSheet, ImageBackground, Alert, useColorScheme } from 'react-native';
import CardCustomCalendar from '../../../components/CustomCardCalendar';
import { useNavigation } from '@react-navigation/native';
import {ref, onValue, getDatabase} from "firebase/database"
import {auth} from "../../../database/firebase"

export default function Diary() {

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

      const agenaRef = ref(db, `users/${userID}/diaries`) 

      // console.log(typeof userID + ": " + userID)


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

  useEffect(()=>{
    verificarTodasAgendas()
  },[])

  return (
    <SafeAreaView style={[styles.container,{backgroundColor: backgoundH}]}>
      
      <ImageBackground source={require('../../../../assets/Frutas_home.png')} style={styles.homeBackground}>

        {agendas.map((agenda)=>(
          <CardCustomCalendar
          key={agenda.id}
          horario={agenda.hora}
          alimentacao={agenda.refeicao}
          onPressEdit={()=>{navigate.navigate("Edit-Diary", {id: agenda.id, refeicao: agenda.refeicao, hora: agenda.hora})}}
          />
        ))}

        <TouchableOpacity style={styles.button} onPress={()=>{setConcluido(true); navigate.navigate("Create-Diary")}}>
          <Text style={{fontSize: 43, textAlign: 'center', paddingBottom: 11.5,color:'white'}}>{"+"}</Text>
        </TouchableOpacity>

      </ImageBackground>

    </SafeAreaView>

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
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
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
    position: 'absolute', 
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