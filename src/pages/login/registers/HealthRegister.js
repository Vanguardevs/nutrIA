import { SafeAreaView, StyleSheet, TouchableOpacity, View, Text, Alert, useColorScheme, ImageBackground } from "react-native";
import CustomField from "../../../components/CustomField";
import { useRoute, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import CustomPicker from "../../../components/CustomPicker";
import CustomButton from "../../../components/CustomButton";
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth";
import { auth, app } from "../../../database/firebase";
import {getDatabase, ref, set} from "firebase/database";
import styles from "../../../theme/styles";

export default function HealthRegister() {

    const colorScheme = useColorScheme();

    const background = colorScheme === 'dark'? "#1C1C1E" : "#F2F2F2";
    const texts = colorScheme === 'dark'? "#F2F2F2" : "#1C1C1E";

    const route = useRoute();
    const {nome, email, password, idade, sexo} = route.params;
    const navigation = useNavigation();

    const [altura, setAltura] = useState();
    const [peso, setPeso] = useState();
    const [objetivo, setObjetivo] = useState('');

        function cadastro(){
            try {
                if(altura == 0 || peso == 0 || objetivo.length === 0){
                    Alert.alert("Tente novamente", "Alguns dos campos de cadastro estão vazios");
                    console.log("Alguns dos campos de cadastro estão vazios")
                    return;
                }
                
                createUserWithEmailAndPassword(auth, email, password)
                
                .then((userCredential) => {

                    sendEmailVerification(auth.currentUser)
                    Alert.alert("Verifique seu e-mail");
                    console.log("Verifique seu e-mail");

                    console.log("Usuário cadastrado com sucesso!");

                    const db = getDatabase(app);
                    const userRef = ref(db, `users/${userCredential.user.uid}`);

                    const userData = {
                        nome,
                        email,
                        idade,
                        sexo,
                        altura,
                        peso,
                        objetivo
                    }

                    set(userRef, userData)
                    .then(() => {
                        console.log("Dados do usuário salvos com sucesso!");
                    })
                    signOut(auth)
                    navigation.navigate("Login")

                })
                .catch((error)=>{
                    Alert.alert("Erro ao salvar dados do usuário", "Tente novamente mais tarde")
                    console.log("Erro ao salvar dados do usuário:", error)

                })


            } catch (error) { 
                console.log(error)
            }
        }

        function handleAltura(input) {
            let alturaFormatada = input.replace(/[^0-9]/g, '').slice(0, 3);
            let alturaFormatada2 = alturaFormatada;
            if (alturaFormatada.length > 1) {
                alturaFormatada2 = `${alturaFormatada.slice(0, 1)}.${alturaFormatada.slice(1, 3)}`;
            }
            setAltura(alturaFormatada2);
        }

        function handlePeso(input) {
            let pesoFormatado = input.replace(/[^0-9]/g, '').slice(0, 3);
            let pesoFormatado2 = pesoFormatado;
            if (pesoFormatado.length > 1) {
                pesoFormatado2 = `${pesoFormatado.slice(0, 2)},${pesoFormatado.slice(2, 3) || '0'}`;
            }
            setPeso(pesoFormatado2);
        }



    return (
        <SafeAreaView style={[styles.hrContainer,{backgroundColor: background}]}>

            <ImageBackground
                source={require('../../../../assets/Frutas_home.png')} 
                style={styles.hrBackgroundImage}
            >

            <View style={styles.hrForm}>
                <CustomField title="Altura" placeholder="Insira sua altura" value={altura} setValue={handleAltura} keyboardType='numeric'/>
                <CustomField title="Peso" placeholder="Insira seu peso" value={peso} setValue={handlePeso} keyboardType='numeric'/>

                    <CustomPicker
                        label="Meta"
                        selectedValue={objetivo}
                        onValueChange={(value)=> setObjetivo(value)}
                        options={[
                        { label: "Emagrecimento", value: "Emagrecimento" },
                        { label: "Saúde", value: "Saúde" },
                        { label: "Musculo", value: "Musculo" }
                        ]}
                    />
                
                <TouchableOpacity onPress={() => navigation.navigate("Restricoes")} style={styles.hrLink}>
                    <Text style={styles.hrLinkText}>Restrições Alimentares</Text>
                </TouchableOpacity>

                
                <View style={styles.hrBottom}>
                <CustomButton title="Cadastrar" modeButton={true} onPress={cadastro}/>
                </View>
            </View>
            </ImageBackground>
        </SafeAreaView>
        
    );
}

