import React, { useState, useEffect } from 'react';
import CustomButton from '../../../components/CustomButton';
import CustomField from '../../../components/CustomField';
import { View, SafeAreaView, Text, useColorScheme, Button } from 'react-native';
import { getDatabase, onValue, ref } from 'firebase/database';
import { auth } from '../../../database/firebase';
import { multiFactor, PhoneMultiFactorGenerator, RecaptchaVerifier} from 'firebase/auth';


export default function SecurityAccount() {


    const [phone, setPhone] = useState();
    const [code, setCode] = useState();
    const [verificationId, setVerificationId] = useState();

    const colorScheme = useColorScheme();

    const background = colorScheme === 'dark'? "#1C1C1E" : "#F2F2F2";
    const texts = colorScheme === 'dark'? "#F2F2F2" : "#1C1C1E";

    useEffect(()=>{
        function getData(){
            const userID = auth.currentUser.uid;
            const phoneData = auth.currentUser.phoneNumber;

            if(phoneData){
                setPhone(phoneData);
            }
        }
        getData()
    },[])

  async function enviarCodigo() {
    if (!phone || phone.length < 10) {
        Alert.alert("Erro", "Número de telefone inválido");
        return;
    }

    try {
        const recaptchaVerifier = new RecaptchaVerifier(
            'recaptcha-container',
            {
                size: 'invisible',
                callback: (response) => {
                    console.log("Recaptcha verificado com sucesso!");
                },
            },
            auth
        );

        const verification = await auth.signInWithPhoneNumber(phone, recaptchaVerifier);
        
        setVerificationId(verification.verificationId);
        Alert.alert("Sucesso", "Código de verificação enviado!");
    } catch (error) {
        console.error("Erro ao enviar o código: ", error);
        Alert.alert("Erro", "Erro ao enviar o código de verificação.");
    }
}

    async function verificarCodigo(){
        if(!code){
            Alert.alert("Erro", "Código inválido")
            console.log("Código inválido")
            return;
        }
        try{
            const user = auth.currentUser;
            const multiFactorUser = multiFactor(user);
            const credential = PhoneMultiFactorGenerator.credential(verificationId, code);
            await multiFactorUser.enroll(credential, "Verificação de telefone");
            console.log("Código verificado com sucesso!")
            Alert.alert("Sucesso", "Código verificado com sucesso!")
        }

        catch(error){
            console.log("Erro ao verificar o código: ", error)
            Alert.alert("Erro", "Erro ao verificar o código")
        }
    }

    return(
        <SafeAreaView style={{backgroundColor: background, flex: 1}}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: texts}}>Configurações de Segurança</Text>
                <CustomField
                    title="Numero de telefone"
                    placeholder='Seu telefone'
                    value={phone}
                    onValue={setPhone}
                    keyboardType='numeric'
                />
                <CustomButton title="Enviar Código" modeButton={true} onPress={enviarCodigo}/>
                <CustomField
                    title='Código de verificação'
                    placeholder="Código de verificação"
                    value={code}
                    onValue={setCode}
                    keyboardType='numeric'
                />
                <CustomButton title="Verificar Código" modeButton={true} onPress={verificarCodigo}/>
                <View id="recaptcha-container"></View>
            </View>
        </SafeAreaView>
    );
}