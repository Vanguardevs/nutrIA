import { View, Text, Button, TextInput, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { useState } from "react";
import database from "../../database/firebase.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-web";
import CustomButton from "../../components/CustomButton";
import CustomField from "../../components/CustomField";

export default function LoginPag() {

  const navegacao = useNavigation();
  const [modal, setModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function logar() {
    try {
      // await signInWithEmailAndPassword(database.auth, email, password); //Comentar para logar sem login XD  
      console.log("Sucesso ao fazer o login!");
      setModal(true);
      navegacao.navigate("appTab")
    } catch (error) {
      console.log(`O erro é: ${error}`)
      const sucesso = 0;
    }
  }

  return (
    <SafeAreaView style={stylesLocal.container}>

      <Modal
        visible={modal}
        onRequestClose={() => setModal(false)}
        animationType="slide"
        transparent={true}>
        <View>
          <Text>Sucesso ao cadastrar</Text>
          <Button title="Fechar" onPress={() => setModal(false)} />
        </View>
      </Modal>

      <View style={stylesLocal.centerContainer}>

        <CustomField title='Email' placeholder="Insira seu email" keyboardType='email-address' value={email} setValue={setEmail} />

        <CustomField title='Senha' placeholder="Insira sua senha"
          secureTextEntry value={password} setValue={setPassword} />

        {/* 
        <Text>Email:</Text>
        <TextInput style={stylesLocal.input} placeholder='Insira seu email:' value={email} onChangeText={setEmail}></TextInput>

        <Text>Senha:</Text>
        <TextInput style={stylesLocal.input} placeholder='Insira sua senha:' value={password} onChangeText={setPassword}></TextInput> 

        Mudamos isso para algo setado no 'components'
      */}

      </View>

      <View style={stylesLocal.bottomContainer}>
        <CustomButton title="Login" onPress={logar} />
        <TouchableOpacity onPress={() => navegacao.navigate('Register')}>
          <Text>Não é cadastrado?</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  )
}

const stylesLocal = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
  },
  input: {
    backgroundColor: 'gray',
    width: '80%', // Adjust the width as needed
    marginVertical: 10, // Add some vertical margin for spacing
    padding: 10,
    borderRadius: 10, // Add padding for better text input appearance
  },
  bottomContainer: {
    justifyContent: 'flex-end', // Align to the bottom
    alignItems: 'center', // Center horizontally
    padding: 16, // Add padding for better spacing
  }
});