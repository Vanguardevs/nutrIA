import { SafeAreaView } from "react-native";
import {useRoute} from "@react-navigation/native";
import React, {useEffect} from "react";

export default function HealthRegister() {

    const route = useRoute();
    const {nome, email, password, idade, sexo} = route.params;

    useEffect(() => {
        console.log("Nome: ", nome);
        console.log("Email: ", email);
        console.log("Senha: ", password);
    });

    return(
        <SafeAreaView>

        </SafeAreaView>
    );
}