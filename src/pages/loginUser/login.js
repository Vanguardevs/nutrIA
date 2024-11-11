import { View, Text, Button, TextInput, StyleSheet } from "react-native";
import { useState } from "react";
import loginC from '../../database/controller/auth.js';
import { useNavigation } from "@react-navigation/native";

export default function LoginPag(){
    const navegacao = useNavigation();

    const [email, setEmail] = useState('lugiaehoho@gmail.com');
    const [password, setPassword] = useState('hub@23DC');

    async function logar(){
      try{
      await loginC.Login(email, password);
      return navegacao.navigate("Home");
      }catch(error){
        console.log(error)
      }
    }

    return(
        <View style={styles.container}>
        <Text>Email</Text>
        <TextInput style={styles.input} placeholder='Insira seu email:' value={email} onChangeText={setEmail}></TextInput>
        <Text>Senha:</Text>
        <TextInput style={styles.input} placeholder='Insira sua senha:' value={password} onChangeText={setPassword}></TextInput>
        <Button title='Logar no app' onPress={logar}></Button>
      </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    input:{
      backgroundColor: 'gray',
    }
  });
  