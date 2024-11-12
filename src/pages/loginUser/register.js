import {Text, TouchableOpacity, StyleSheet, View, SafeAreaView, TextInput} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {useState} from 'react';

export default function createUser(){

//Criação de uma variavel para pegar o nome do usuario
const [nome, setNome] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

async function createUser(){
    createUserWithEmailAndPassword(email, password);
}

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.caixa_branca}>
                <Text>Nome:</Text><TextInput
                placeholder='Insira seu nome:'
                style={styles.inputs}
                value={nome}
                onChangeText={setNome}
                />
                <Text>Email:</Text><TextInput
                placeholder='Insira seu email:'
                style={styles.inputs}
                value={email}
                onChangeText={setEmail}
                />
                <Text>Senha:</Text><TextInput
                placeholder='Insira sua senha:'
                style={styles.inputs}
                value={password}
                onChangeText={setPassword}
                />
            </View>
            <TouchableOpacity style={styles.botao} onPress={createUser}>
                <Text>Criar a conta</Text>
            </TouchableOpacity>

        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
    },
    caixa_branca:{
        backgroundColor: 'white'
    },
    inputs:{

    },
    botao:{
        backgroundColor: 'yellow'
    }
})