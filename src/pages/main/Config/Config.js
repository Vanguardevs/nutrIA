import { View, Image, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import {ref, onValue, getDatabase} from "firebase/database";
import { CommonActions, useNavigation } from "@react-navigation/native";
import CustomButton from "../../../components/CustomButton";
import CustomCardO from "../../../components/CustomButtonConfig";
import { auth } from "../../../database/firebase";
import { signOut } from "firebase/auth";

export default function Settings(){



    const navigation = useNavigation();

    function loggout(){
        signOut(auth).then(() => {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                })
            );
        }).catch((error) => {
            console.log(error);
        });
    }


    return(
        <View style={styles.container}>
            <Image source={require("../../../../assets/logoWelcome.png")} style={styles.imageStyle}/>
            <CustomCardO title="Dados Pessoais" onPress={()=> navigation.navigate("DataUser")} nameImg="happy-outline"/>
            <CustomCardO title="Conta" onPress={()=> navigation.navigate("AccountUser")} nameImg="person-circle-outline"/>
            <CustomCardO title="Seguraça" onPress={()=> navigation.navigate("SecurityAccount")} nameImg="lock-closed"/>
            <CustomButton title="Sair" onPress={loggout} modeButton={false}/>
        </View>
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