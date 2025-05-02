import React,{useState, useEffect} from 'react';
import { SafeAreaView ,View, Text, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';
import CardCustomCalendar from '../../../components/CustomCardCalendar';
import { useNavigation } from '@react-navigation/native';
import {ref, onValue, getDatabase} from "firebase/database"
import {auth} from "../../../database/firebase"

export default function Diary() {

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
    <SafeAreaView style={styles.container}>
      
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
          <Text style={{fontSize: 43, textAlign: 'center', paddingBottom: 11.5,}}>{"+"}</Text>
        </TouchableOpacity>

      </ImageBackground>

    </SafeAreaView>

  );
}


const styles = StyleSheet.  create({
  container: {
  flex: 1,  
  width: '100%',
  height: '100%'
  },
  homeBackground: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    width: '100%',
},
  button: {
    backgroundColor: '#068f25',
    padding: 10,
    borderRadius: 40,
    height: '7.5%',
    width:'13.5%',
    alignItems: 'center',
    justifyContent: 'center',
    left: '42.5%',
    textAlign: 'center',
    },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
})