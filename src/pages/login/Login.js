import { useColorScheme ,View, Text, Button, TextInput, StyleSheet, SafeAreaView, Modal, TouchableOpacity, Alert, ImageBackground } from "react-native";
import { useState } from "react";
import {auth} from "../../database/firebase.js";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../../components/CustomButton";
import CustomField from "../../components/CustomField";
import styles from "../../theme/styles";
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginPag() {

    const colorSheme = useColorScheme();
  
    const background = colorSheme === 'dark'? "#1C1C1E" : "#F2F2F2";
    const texts = colorSheme === 'dark'? "#F2F2F2" : "#1C1C1E";

  const navegacao = useNavigation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function logar() {

      if(email.length === 0 || password.length === 0){
        Alert.alert("Erro", "Alguns dos campos de login estão vazios")
        console.log("Alguns dos campos de login estão vazios")
        return;
      }
      await signInWithEmailAndPassword(auth, email, password).then(()=>{
        if(auth.currentUser.emailVerified == false){
          Alert.alert("Verifique seu e-mail", "Você não verificou seu e-mail ainda")
          console.log("Você não verificou seu e-mail ainda")
          signOut(auth)
          return;
        }

      console.log("Sucesso ao fazer o login!");
      })
      .catch((error) => {
        
        if(error.code == 'auth/invalid-credential'){
          console.log("Senha inválida")
          Alert.alert("Inválida", "Senha Inválida!")
          return;
        } 

        if(error.code == 'auth/invalid-email'){
          console.log("Esse tipo de text não é email. Isso é inválido")
          Alert.alert("Inválido", "Esse email não é válido")
          return;
        }

        Alert.alert("Erro ao fazer login", "Verifique seu email e senha e tente novamente")
        console.log("Erro ao fazer login:", error);
      })
  }

  return (
    <SafeAreaView style={[styles.loginContainer,{backgroundColor: background}]}>

      <ImageBackground
      source={require('../../../assets/Frutas_home.png')}
      style={styles.loginBackground}>


        <View style={styles.loginCenter}>
          <CustomField 
          title='Email' 
          placeholder="Insira seu email" 
          keyboardType='email-address' 
          value={email} 
          setValue={setEmail}
          />
          

          <CustomField 
          title='Senha' 
          placeholder="Insira sua senha" 
          keyboardType="text"
          secureTextEntry value={password} 
          setValue={setPassword} 
          />

          <TouchableOpacity onPress={() => navegacao.push('ForgetPassword')}>
            <Text style={{color: texts, fontSize: 15, textAlign: 'right', marginRight: 10, marginTop: -10}}>Esqueci minha senha</Text>
          </TouchableOpacity>

        </View>

        <View style={styles.loginBottom}>
      
          <CustomButton title="Login" onPress={logar} style={{width: '100%'}} modeButton={true}/>


          <TouchableOpacity 
          onPress={() => navegacao.push('Registro')}
          style={{margin: 10}}
          >
          <Text style={{fontSize: 15, color: texts}}>

            Não possui conta?{' '}
            <Text style={{ color: 'green', fontWeight: 'bold' ,fontSize: 17 }}>Crie agora</Text>
            
            </Text>
          </TouchableOpacity>

        </View>
        
      </ImageBackground>

    </SafeAreaView>

  )
}