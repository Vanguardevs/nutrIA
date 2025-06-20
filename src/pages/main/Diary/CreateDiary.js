import {View, SafeAreaView, ImageBackground, StyleSheet, Alert, useColorScheme} from 'react-native';
import CustomField from '../../../components/CustomField';
import CustomButton from '../../../components/CustomButton';
import React,{ useEffect, useState } from 'react';
import { push, getDatabase, ref } from 'firebase/database';
import { auth } from '../../../database/firebase';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from "expo-notifications";


export default function CreateDiary(){


    const colorSheme = useColorScheme();
    
    const backgoundH = colorSheme === 'dark'? "#1C1C1E" : "#F2F2F2"
    const backgoundIcons = colorSheme === 'dark'? "#F2F2F2" : "#1C1C1E"

    const [refeicao, setRefeicao] = useState('');
    const [hora, setHora] = useState('');

    const navigation = useNavigation();

    function handleHora(input){

        const apenasNumero = input.replace(/[^0-9]/g, '');

        let horaFormatada = apenasNumero;
        if(apenasNumero.length > 2){
            horaFormatada = `${apenasNumero.slice(0,2)}:${apenasNumero.slice(2,4)}`
    }
    setHora(horaFormatada);
}

    async function salvarAgenda(){
        if(refeicao == '' || hora == ''){
            Alert.alert("Tente novamente", "Alguns dos campos de cadastro estão vazios");
            console.log("Alguns dos campos de cadastro estão vazios")
            return;
        }

        //Criando um cadastro no banco da agenda
        try{

            const userID = auth.currentUser?.uid
            if(!userID){
                Alert.alert("Não foi possível te encontrar no banco")
                return;
            }

            const db = getDatabase();
            const diaryRef = ref(db, `users/${userID}/diaries`);

            const novaRefei = {
                refeicao,
                hora
            }

            await push(diaryRef, novaRefei)
            .then(()=>{
                setRefeicao('');
                setHora('');
                console.log("Cadastrado sua agenda com sucesso!")
            })

            Alert.alert("Cadastrado sua agenda com sucesso!");
            navigation.goBack();
        }
        catch(error){
            console.log("ERROR " + error)
            Alert.alert("ERROR", "Erro ao cadastrar a agenda no banco de dados")
        }
    }
    

    return(
        <SafeAreaView style={[styles.container,{backgroundColor:backgoundH}]}>

            <ImageBackground source={require('../../../../assets/Frutas_home.png')} style={styles.imgBackgound}>
                
                <View style={styles.container_items}>

                    <CustomField title="Refeição" placeholder='Refeição' value={refeicao} setValue={(d)=>setRefeicao(d)}/>
                    <CustomField title="Horario" placeholder='Horario' value={hora} setValue={handleHora} keyboardType="numeric"/>

                    <CustomButton title="Salvar" onPress={salvarAgenda} modeButton={true}/>

                </View>

            </ImageBackground>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center'
    },
    container_items:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        marginTop: '10%',
        marginBottom: '10%',
        padding: 20,
    },
    imgBackgound:{
        height: '100%',
        width: '100%',
    }
})