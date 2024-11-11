import { View, Text, Button, TextInput, StyleSheet } from "react-native";
import { useState } from "react";
import database from "../../database/config/firebase.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

export default function LoginPag(){
    const navegacao = useNavigation();

    const [email, setEmail] = useState('lugiaehoho@gmail.com');
    const [password, setPassword] = useState('hub@23DC');

    async function logar(){
      try{
        await signInWithEmailAndPassword(database.auth, email, password);
        console.log("Sucesso ao fazer o login!");
        navegacao.navigate("Home");
        }catch(error){
            console.log(`O erro é: ${error}`)
            sucesso = 0;
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
  