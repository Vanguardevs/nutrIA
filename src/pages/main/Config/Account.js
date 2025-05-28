import React, { useState, useEffect } from 'react';
import CustomField from '../../../components/CustomField';
import { View, SafeAreaView, Text, useColorScheme, Button, Alert } from 'react-native';
import CustomButton from '../../../components/CustomButton';
import { getDatabase, onValue, ref, update } from 'firebase/database';
import { auth } from '../../../database/firebase';
import { sendPasswordResetEmail, updateEmail } from 'firebase/auth';

export default function AccountUser() {

    const [email, setEmail] = useState('');

    const colorScheme = useColorScheme();

    const background = colorScheme === 'dark'? "#1C1C1E" : "#F2F2F2";
    const texts = colorScheme === 'dark'? "#F2F2F2" : "#1C1C1E";

    useEffect(()=>{
        function getData(){
            const db = getDatabase();
            const userID = auth.currentUser.uid;
            const userRef = ref(db, 'users/' + userID);

            onValue(userRef, (resp)=>{
            const data = resp.val();
            if(data){
                setEmail(data.email);
            }
            });

        }
        getData()
    },[])

    function RedefinePassword(){
        if(email === ''){
            console.log('Por favor, insira um email válido.');
            return;
        }

        sendPasswordResetEmail(auth, auth.currentUser.email)
            .then(() => {
                Alert.alert('Email de redefinição de senha enviado com sucesso!');
            })
            .catch((error) => {
                console.error('Erro ao enviar email de redefinição de senha:', error);
                Alert.alert('Erro ao enviar email. Tente novamente mais tarde.');
            });
    }

    function updateEmailAddress() {
        if(email === ''){
            alert('Por favor, insira um email válido.');
            return;
        }
        const db = getDatabase();
        const userID = auth.currentUser.uid;
        const userRef = ref(db, 'users/' + userID);
        update(userRef, { email: email })
        .then(() => {
            updateEmail(auth.currentUser, email)
                .then(() => {
                    Alert.alert('Email atualizado com sucesso!');
                })
                .catch((error) => {
                    console.error('Erro ao atualizar email:', error);
                    Alert.alert('Erro ao atualizar email. Tente novamente mais tarde.');
                });

        })

    }

    return(
        <SafeAreaView style={{backgroundColor: background, flex:1}}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <CustomField title='Email atual' placeholder="Seu email" value={email} setValue={setEmail}/>
                <Button title='Redefinir senha' onPress={RedefinePassword}/>
                <CustomButton title='Salvar dado' modeButton={true} onPress={updateEmailAddress}/>
            </View>
        </SafeAreaView>
    );
}