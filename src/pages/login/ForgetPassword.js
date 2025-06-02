import React, {useState, useEffect} from 'react';
import { SafeAreaView, View, useColorScheme, ImageBackground, StyleSheet, Alert } from 'react-native';
import CustomButton from '../../components/CustomButton';
import CustomField from '../../components/CustomField';
import {auth} from '../../database/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function ForgetPassword() {

    const colorScheme = useColorScheme();

    const background = colorScheme === 'dark' ? "#1C1C1E" : "#F2F2F2";
    const texts = colorScheme === 'dark' ? "#F2F2F2" : "#1C1C1E";

    const [email, setEmail] = useState('');


    async function resetPassword() {
        if (email.length === 0) {
            Alert.alert("Erro", "O campo de email está vazio");
            console.log("O campo de email está vazio");
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            Alert.alert("Sucesso", "Email de redefinição de senha enviado!");
            console.log("Email de redefinição de senha enviado!");
        } 
        catch (e) {
            console.error("Erro ao enviar email de redefinição de senha:", e);
            Alert.alert("Erro", "Não foi possível enviar o email de redefinição de senha. Verifique seu email e tente novamente.");
        }
    }

    return(
        <SafeAreaView style={{ flex: 1, backgroundColor: background }}>
            <ImageBackground source={require('../../../assets/Frutas_home.png')} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <CustomField title="Email" placeholder="Digite seu email" value={email} setValue={setEmail}/>
                <CustomButton title="Enviar" onPress={resetPassword} modeButton={true}/>
            </ImageBackground>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F2F2F2',
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
})