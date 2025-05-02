import React, { useEffect, useState } from 'react';
import CustomButton from '../../../components/CustomButton';
import CustomField from '../../../components/CustomField';
import CustomPicker from '../../../components/CustomPicker';
import { View, SafeAreaView, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {ref, onValue, getDatabase, update} from 'firebase/database';
import {auth} from '../../../database/firebase';

export default function DataUser() {

        const navigation = useNavigation();

        const [nome, setNome] = useState('');
        const [altura, setAltura] = useState('');
        const [peso, setPeso] = useState('');
        const [idade, setIdade] = useState('');
        const [objetivo, setObjetivo] = useState('');

    useEffect(()=>{
        const db = getDatabase();
        const userID = auth.currentUser.uid;
        const userRef = ref(db, 'users/' + userID);
        
        onValue(userRef, (resp)=>{
           const data = resp.val();
           if(data){
            setNome(data.nome);
            setAltura(data.altura);
            setPeso(data.peso);
            setIdade(data.idade);
            setObjetivo(data.objetivo);
           }
        })
    },[])

    function AtualizarDados(){
        const db = getDatabase();
        const userID = auth.currentUser.uid;
        const userRef = ref(db, 'users/' + userID);

        if(nome.length === 0 || idade.length === 0 || objetivo.length === 0 || peso.length === 0 || altura.length === 0){
            Alert.alert("Tente novamente", "Alguns dos campos de cadastro estão vazios")
            console.log("Campos vazios")
            return;
          }

        update(userRef,{
            nome: nome,
            altura: altura,
            peso: peso,
            idade: idade,
            objetivo: objetivo
        }).then(() => {
            console.log('Dados atualizados com sucesso!');
            Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
            navigation.goBack();
        }).catch((error) => {
            console.error('Erro ao atualizar os dados:', error);
            Alert.alert('Erro', 'Não foi possível atualizar os dados. Tente novamente mais tarde.');
        });
    }



    return(
        <SafeAreaView>
            <View style={{display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <CustomField title='Nome atual' placeholder="Seu nome atual" value={nome} setValue={setNome}/>
                <CustomField title='Idade atual' placeholder="Sua Idade atual" value={idade} setValue={setIdade}/>
                <CustomPicker
                    label="Objetivo"
                    selectedValue={objetivo}
                    onValueChange={(value)=> setObjetivo(value)}
                    options={[
                        { label: "Emagrecimento", value: "Emagrecimento" },
                        { label: "Musculo", value: "Musculo" },
                        { label: "Saúde", value: "Saúde" }
                    ]}
                />
                <CustomField title='Peso atual' placeholder="Seu peso atual" value={peso} setValue={setPeso}/>
                <CustomField title='Peso atual' placeholder="Seu peso atual" value={altura} setValue={setAltura}/>
                <CustomButton title='Salvar dado' modeButton={true} onPress={AtualizarDados}/>
            </View>
        </SafeAreaView>
    );
}