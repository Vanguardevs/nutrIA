import { View, Text, Button, TextInput, StyleSheet, Modal} from "react-native";
import { useState } from "react";
import database from "../../database/config/firebase.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

export default function LoginPag(){

  //Criação de uma variavel que usa a função ne navegacao
  const navegacao = useNavigation();

  //Criaçao de um useState para delimitar quando o Modal irá aparecer
  const [modal, setModal] = useState(false);

  //Email e senha que serão enviados ao banco de dados
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //Funçao de login
  async function logar(){
    try{
      await signInWithEmailAndPassword(database.auth, email, password);
      console.log("Sucesso ao fazer o login!");
      <Modal
      visible={modal}
      onRequestClose={()=>setModal(false)}>
        <Text>Login feito com sucesso!</Text>
        <Button onPress={()=> setModal(true)}/>
      </Modal>
      }catch(error){
          console.log(`O erro é: ${error}`)
          sucesso = 0;
  }
    }

    return(
        <View style={styles.container}>
        <Text>Email:</Text>
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
  