import {Text, TouchableOpacity, StyleSheet, View, SafeAreaView, TextInput} from "react-native";
import database from "../../database/firebase";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {useState} from 'react';
import CustomField from "../../components/CustomField";
import CustomButton from "../../components/CustomButton";

export default function CreateUser(){

//Criação de uma variavel para pegar o nome do usuario
const [nome, setNome] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const navegacao = useNavigation();

async function createUser(){
    try{
    await createUserWithEmailAndPassword(database.auth, email, password);
    console.log("Usuário cadastrado com sucesso!");
    navegacao.navigate('Login');
    }catch(error){
        if(nome.length == '' || password.length == '' || nome.length == ''){
            console.log("Alguns dos campos de cadastro estão vazios, Tente novamente")
        }else{
            console.log(error)
        }
    }
}

    return(
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={() => navegacao.goBack()} style={{backgroundColor: 'gray', padding: 10, borderRadius: 10, margin: 10, height: 40, width: 40}}>
                <Text>{"<"}</Text>
            </TouchableOpacity>

            <View style={styles.centerContainer}>
                <CustomField title="Nome" value={nome} setValue={setNome} keyboardType="text" placeholder="Insira seu nome"/>
                <CustomField title="Email" value={email} setValue={setEmail} keyboardType="email-address" placeholder="Insira seu email"/>
                <CustomField title="Senha" value={password} setValue={setPassword} keyboardType="text" placeholder="Insira sua senha"
                secureTextEntry/>
            </View>
            <View style={styles.bottomContainer}>
                <CustomButton title="Criar usuário" onPress={createUser}/>
            </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
      },
      centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      input: {
        backgroundColor: 'gray',
        width: '80%', 
        marginVertical: 10,
        padding: 10,
        borderRadius: 10,
      },
      bottomContainer: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: 16,
      }
})