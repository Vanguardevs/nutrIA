import React,{useState, useEffect} from 'react';
import { SafeAreaView ,View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import CardCustomCalendar from '../../../components/CustomCardCalendar';
import { useNavigation } from '@react-navigation/native';

export default function Diary() {
  const navigate = useNavigation()
  const [concluido, setConcluido] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      
      <ImageBackground source={require('../../../../assets/Frutas_home.png')} style={styles.homeBackground}>

        <CardCustomCalendar horario='09:00' alimentacao='Café da manhã' onPressEdit={()=>{navigate.navigate("Edit-Diary")}}/>

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