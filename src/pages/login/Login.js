import { View, Text, Button, TextInput, StyleSheet, SafeAreaView, Modal, TouchableOpacity, Alert, ImageBackground } from "react-native";
import { useState } from "react";
import {auth} from "../../database/firebase.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../../components/CustomButton";
import CustomField from "../../components/CustomField";
import styles from "../../theme/styles";
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginPag() {

  const AlertaError = () => Alert.alert('Error');

  const navegacao = useNavigation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function logar() {
      await signInWithEmailAndPassword(auth, email, password).then(()=>{

        console.log("Sucesso ao fazer o login!");
        
      }).catch((error) => {  
        console.log(error);
        AlertaError();
      })
  }

  return (
    <SafeAreaView style={styles.loginContainer}>

      <ImageBackground
      source={require('../../../assets/Frutas_home.png')}
      style={styles.loginBackground}>


        <View style={styles.loginCenter}>
          <CustomField 
          title='Email' 
          placeholder="Insira seu email" 
          keyboardType='email-address' 
          value={email} 
          setValue={setEmail}/>
          

          <CustomField 
          title='Senha' 
          placeholder="Insira sua senha" 
          keyboardType="text"
          secureTextEntry value={password} 
          setValue={setPassword} />
        </View>

        <View style={styles.loginBottom}>
      
          <CustomButton title="Login" onPress={logar} style={{width: '100%'}} modeButton={true}/>


          <TouchableOpacity 
          onPress={() => navegacao.push('Registro')}
          style={{margin: 10}}
          >
            <Text>Não possui conta? Crie agora</Text>
          </TouchableOpacity>

        </View>
        
      </ImageBackground>
    </SafeAreaView>

  )
}

const stylesLocal = StyleSheet.create({
  


});
