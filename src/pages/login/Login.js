import { View, Text, Button, TextInput, StyleSheet, SafeAreaView, Modal, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import {auth} from "../../database/firebase.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../../components/CustomButton";
import CustomField from "../../components/CustomField";
import styles from "../../theme/styles";
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginPag() {

  const AlertaError = ()=> Alert.alert('Error', "Erro ao fazer o login. Tente novamente",[{text: "OK", onPress:()=>console.log("")}],{});



  const navegacao = useNavigation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function logar() {
      await signInWithEmailAndPassword(auth, email, password).then(()=>{

        console.log("Sucesso ao fazer o login!");
        navegacao.replace("appTab");

      }).catch((error) => {  
        console.log(error);
        AlertaError();
      })
  }

  return (
    <SafeAreaView style={styles.loginContainer}>

      <View style={styles.loginCenter}>
        <CustomField title='Email' placeholder="Insira seu email" keyboardType='email-address' value={email} setValue={setEmail} />
        <CustomField title='Senha' placeholder="Insira sua senha" keyboardType="text"
          secureTextEntry value={password} setValue={setPassword} />
      </View>

      <View>
     
        <CustomButton style={styles.loginBottom} title="Login" onPress={logar}/>

        <TouchableOpacity onPress={() => navegacao.push('Registro')}>


          <Text>Não é cadastrado?</Text>
        </TouchableOpacity>

      </View>

    </SafeAreaView>
  )
}

const stylesLocal = StyleSheet.create({



});
