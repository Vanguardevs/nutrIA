import { SafeAreaView, StyleSheet, TouchableOpacity, View, Text, Alert, useColorScheme } from "react-native";
import CustomField from "../../components/CustomField";
import { useRoute, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import CustomPicker from "../../components/CustomPicker";
import CustomButton from "../../components/CustomButton";
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth";
import { auth, app } from "../../database/firebase";
import {getDatabase, ref, set} from "firebase/database";
import styles from "../../theme/styles";

export default function HealthRegister() {

    const colorScheme = useColorScheme();

    const background = colorScheme === 'dark'? "#1C1C1E" : "#F2F2F2";
    const texts = colorScheme === 'dark'? "#F2F2F2" : "#1C1C1E";

    const route = useRoute();
    const {nome, email, password, idade, sexo} = route.params;
    const navigation = useNavigation();

    const [altura, setAltura] = useState(0);
    const [peso, setPeso] = useState(0);
    const [objetivo, setObjetivo] = useState('');

        function cadastro(){
            try {
                if(altura == 0 || peso == 0){
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

    return (
        <SafeAreaView style={[styles.hrContainer,{backgroundColor: background}]}>

            <View style={styles.hrForm}>
                <CustomField title="Altura" placeholder="Insira sua altura" value={altura} setValue={(d)=>setAltura(d)} keyboardType='numeric'/>
                <CustomField title="Peso" placeholder="Insira seu peso" value={peso} setValue={(d)=>setPeso(d)} keyboardType='numeric'/>

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
        </SafeAreaView>
    );
}

