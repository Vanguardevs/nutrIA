import { SafeAreaView, StyleSheet, View } from "react-native";
import CustomField from "../../components/CustomField";
import {useRoute} from "@react-navigation/native";
import React, {useEffect, useState} from "react";
import CustomPicker from "../../components/CustomPicker";
import CustomButton from "../../components/CustomButton";

export default function HealthRegister() {

    const route = useRoute();
    const {nome, email, password, idade, sexo} = route.params;
    const [Altura, setAltura] = useState();
    const [objetivo, setObjetivo] = useState();

    return(
        <SafeAreaView style={styles.container}>
            
            <View style={{alignItems: 'center'}}>

                <CustomField title="Altura" placeholder="Isnira sua altura" value={Altura} setValue={setAltura}/>
                <CustomField title="Peso" placeholder="Insira seu peso"/>

                <CustomPicker label="Objetivo" setValue={objetivo} onValueChange={setObjetivo} options={[
                    {label: "Saúde"},
                    {label: "Emagrecer"},
                    {label: "Musculo"}
                ]}/>
                
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff',
        width: '100%'
    }
})