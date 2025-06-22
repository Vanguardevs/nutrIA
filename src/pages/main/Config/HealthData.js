import React, { useState, useEffect } from 'react';
import CustomButton from '../../../components/CustomButton.js';
import CustomField from '../../../components/CustomField';
import { View, SafeAreaView, Text, useColorScheme, TouchableOpacity } from 'react-native';
import { getDatabase, onValue, ref } from 'firebase/database';
import { auth } from '../../../database/firebase';
import { useNavigation } from '@react-navigation/native';

export default function HealthData() {

    const navigation = useNavigation();

    const [altura, setAltura] = useState();
    const [peso, setPeso] = useState();
    
    const colorScheme = useColorScheme();

    const background = colorScheme === 'dark'? "#1C1C1E" : "#F2F2F2";
    const texts = colorScheme === 'dark'? "#F2F2F2" : "#1C1C1E";

    useEffect(()=>{
        const db = getDatabase();
        const userId = auth.currentUser?.uid;
        const userRef = ref(db, `users/${userId}/`);

        onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setAltura(data.altura);
                setPeso(data.peso);
            }
        });
    },[])

    return(
        <SafeAreaView style={{flex: 1, backgroundColor: background}}>
            <View style={{flex: 1, padding: 20}}>
                <CustomField
                    title="Altura"
                    value={altura}
                    setValue={setAltura}
                />
                <CustomField
                    title="Peso"
                    value={peso}
                    setValue={setPeso}
                />
                <TouchableOpacity onPress={()=>navigation.navigate("EditHealth")} style={{marginTop: 20, padding: 10, backgroundColor: '#007AFF', borderRadius: 5}}>
                    <Text>Condições Médicas</Text>
                </TouchableOpacity>

                <CustomButton
                    title="Salvar"
                    modeButton={true}
                />
            </View>
        </SafeAreaView>
    );
}