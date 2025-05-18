import React, { useState, useEffect } from 'react';
import CustomField from '../../../components/CustomField';
import { View, SafeAreaView, Text, useColorScheme, Button } from 'react-native';
import CustomButton from '../../../components/CustomButton';
import { getDatabase, onValue, ref } from 'firebase/database';
import { auth } from '../../../database/firebase';


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
    })

    return(
        <SafeAreaView style={{backgroundColor: background, flex:1}}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <CustomField title='Email atual' placeholder="Seu email" value={email} onValue={setEmail}/>
                <Button title='Redefinir senha' onPress={() => {}}/>
                <CustomButton title='Salvar dado' modeButton={true}/>
            </View>
        </SafeAreaView>
    );
}