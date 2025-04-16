import {Text, TouchableOpacity, StyleSheet, View, SafeAreaView, TextInput} from "react-native";
import database from "../../database/firebase";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {useState} from 'react';
import CustomField from "../../components/CustomField";
import CustomButton from "../../components/CustomButton";
import CustomPicker from "../../components/CustomPicker";
import { Picker } from '@react-native-picker/picker';


export default function CreateUser(){

//Criação de uma variavel para pegar o nome do usuario
const [nome, setNome] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [idade, setIdade] = useState(0);
const [sexo, setSexo] = useState('')
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

            <View style={styles.centerContainer}>
                <CustomField title="Nome" value={nome} setValue={setNome} keyboardType="text" placeholder="Insira seu nome:"/>
                <CustomField title="Email" value={email} setValue={setEmail} keyboardType="email-address" placeholder="Insira seu email:"/>
                <CustomField title="Senha" value={password} setValue={setPassword} keyboardType="text" placeholder="Insira sua senha:"
                secureTextEntry/>

                <View style={{flexDirection: 'row', width: '80%', margin: '2%'}}>

                    <CustomField title="Idade" value={idade} setValue={setIdade} keyboardType="numeric" placeholder="Insira sua idade:" style={styles.miniField}/>

                <CustomPicker
                  label="Sexo"
                  setValue={sexo}
                  onValueChange={setSexo}
                  options={[
                    { label: "Selecione...", value: "" },
                    { label: "Masculino", value: "masculino" },
                    { label: "Feminino", value: "feminino" },
                    { label: "Outro", value: "outro" }
                  ]}
                  />

                    
                </View>

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
      },
      miniField:{
        height: 35,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom:15,
        width: '65%',
        marginLeft: '5%'
      }
})