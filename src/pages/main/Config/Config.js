import { SafeAreaView, View, Image, StyleSheet, useColorScheme } from "react-native";
import { useEffect, useState } from "react";
import {ref, onValue, getDatabase} from "firebase/database";
import { CommonActions, useNavigation } from "@react-navigation/native";
import CustomButton from "../../../components/CustomButton";
import CustomCardO from "../../../components/CustomButtonConfig";
import { auth } from "../../../database/firebase";
import { signOut } from "firebase/auth";

export default function Settings(){

    const navigation = useNavigation();

    const colorScheme = useColorScheme();

    const background = colorScheme === 'dark'? "#1C1C1E" : "#F2F2F2";

    function loggout(){
        signOut(auth)
        .then(() => {
            
        }).catch((error) => {
            console.log(error);
        });
    }


    return(
        <SafeAreaView style={{justifyContent: 'center', height: '100%'}}>
            <View style={[styles.container,{marginTop: 'auto', marginBottom: 'auto', backgroundColor: background}]}>
                <Image source={require("../../../../assets/logoWelcome.png")} style={styles.imageStyle}/>

                <CustomCardO title="Dados Pessoais" onPress={()=> navigation.navigate("DataUser")} nameImg="happy-outline"/>

                <CustomCardO title="Conta" onPress={()=> navigation.navigate("AccountUser")} nameImg="person-circle-outline"/>

                <CustomCardO title="Seguraça" onPress={()=> navigation.navigate("SecurityAccount")} nameImg="lock-closed"/>

                <CustomButton title="Sair" onPress={loggout} modeButton={false}/>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        
    }, 
    imageStyle:{
        height: 180,
        width: 240,
        paddingTop: 20,
        marginTop: 20,
        marginBottom: 8.5
    }
})