import {View, SafeAreaView, ImageBackground, StyleSheet, Alert} from 'react-native';
import CustomField from '../../../components/CustomField';
import CustomButton from '../../../components/CustomButton';
import React, { useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { getDatabase, ref, remove, update } from 'firebase/database';
import { auth } from '../../../database/firebase';

export default function EditDiary(){

    const route = useRoute();
    const navigation = useNavigation();
    const {id, refeicao, hora} = route.params;

    const [editRefeicao, setEditRefeicao] = useState(refeicao);
    const [editHora, setEditHora] = useState(hora);

    function handleHora(input){

        const apenasNumero = input.replace(/[^0-9]/g, '');

        let horaFormatada = apenasNumero;
        if(apenasNumero.length > 2){
            horaFormatada = `${apenasNumero.slice(0,2)}:${apenasNumero.slice(2,4)}`
    }
    setEditHora(horaFormatada);
}




    async function excluirAgenda(){
        try{
            const userID = auth.currentUser?.uid;
            if(!userID){
                console.log("Usuário não encontrado")
                Alert.alert("Erro", "Não foi possível encontrar o usuário no banco. Tente Novamente!");
            }

            const db = getDatabase();
            const agendaRef = ref(db, `users/${userID}/diaries/${id}`) 
            
            await remove(agendaRef)
            .then(()=>{
                console.log("Excluido com sucesso!")
                navigation.goBack()
            })

        }catch(e){
            console.log(e)
        }
    }

    async function salvarAgenda(){
        try{
            const userID = auth.currentUser?.uid;
            if(!userID){
                console.log("Usuário não encontrado")
                Alert.alert("Erro", "Não foi possível encontrar o usuário no banco. Tente Novamente!");
            }

            const db = getDatabase();
            const agendaRef = ref(db, `users/${userID}/diaries/${id}`)

            await update(agendaRef,{
                refeicao: editRefeicao,
                hora: editHora
            })
            .then(()=>{
                console.log("Atualizado com sucesso!")
                Alert.alert("Atualizado com sucesso!")
                navigation.goBack()
            })
        }
        catch(e){
            console.log(e)
            Alert.alert("Erro", "Não foi possível salvar. Tente Novamente!");
        }
    }

    return(
        <SafeAreaView style={styles.container}>
            <ImageBackground source={require('../../../../assets/Frutas_home.png')} style={styles.imgBackgound}>

                <View style={styles.container_items}>

                    <CustomField title="Refeição" placeholder='Refeição' value={editRefeicao} setValue={(d)=>setEditRefeicao(d)}/>
                    <CustomField title="Horario" placeholder='Horario' value={editHora} setValue={handleHora} keyboardType="numeric"/>

                    <CustomButton title="Salvar" onPress={salvarAgenda} modeButton={true}/>
                    <CustomButton title="Excluir" onPress={excluirAgenda} modeButton={false}/>

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