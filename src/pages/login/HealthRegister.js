import { SafeAreaView, StyleSheet, TouchableOpacity, View, Text, Alert } from "react-native";
import CustomField from "../../components/CustomField";
import { useRoute, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import CustomPicker from "../../components/CustomPicker";
import CustomButton from "../../components/CustomButton";

export default function HealthRegister() {

    const route = useRoute();
    const {nome, email, password, idade, sexo} = route.params;
    const navigation = useNavigation();

    const [Altura, setAltura] = useState(0);
    const [Peso, setPeso] = useState(0);
    const [objetivo, setObjetivo] = useState('');

        function cadastro(){
            try {
                if(Altura.length === 0 || objetivo.length === 0) {
                    Alert.alert("Tente novamente", "Alguns dos campos de cadastro estão vazios");
                    return;
                }
                    console.log("Usuário cadastrado com sucesso!");
                    navigation.navigate('Login');
            } catch (error) { 
                console.log(error)
            }
        }

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.formContainer}>
                <CustomField title="Altura" placeholder="Insira sua altura" value={Altura} setValue={setAltura} keyboardType='numeric'/>
                <CustomField title="Peso" placeholder="Insira seu peso" value={Peso} onValueChange={setPeso} keyboardType='numeric'/>

                <CustomPicker
                    label="Objetivo"
                    setValue={objetivo}
                    onValueChange={setObjetivo}
                    options={[
                        { label: "Saúde" },
                        { label: "Emagrecer" },
                        { label: "Musculo" }
                    ]}
                />

                <TouchableOpacity onPress={() => navigation.navigate("Restricoes")} style={styles.link}>
                    <Text style={styles.linkText}>Restrições Alimentares</Text>
                </TouchableOpacity>

                <CustomButton title="Cadastrar" modeButton={true} onPress={cadastro}/>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 20,
    },
    header: {
        marginTop: 20,
        marginBottom: 30,
        alignItems: 'center',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2E8331',
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
    },
    link: {
        marginTop: 10,
    },
    linkText: {
        fontSize: 16,
        color: '#2E8331',
        textDecorationLine: 'underline',
    },
});