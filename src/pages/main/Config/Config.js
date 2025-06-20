import { SafeAreaView, View, Image, StyleSheet, useColorScheme, Text, ImageBackground } from "react-native";
import { useEffect, useState } from "react";
import {ref, onValue, getDatabase} from "firebase/database";
import { CommonActions, useNavigation } from "@react-navigation/native";
import CustomButton from "../../../components/CustomButton";
import CustomCardO from "../../../components/CustomButtonConfig";
import { auth } from "../../../database/firebase";
import { signOut } from "firebase/auth";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

export default function Settings(){

    const navigation = useNavigation();

    const colorScheme = useColorScheme();

    const background = colorScheme === 'dark'? "#1C1C1E" : "#F2F2F2";
    const green = '#2E8331';
    const lightGreen = '#D0F5D8';
    const cardBg = colorScheme === 'dark' ? '#223322' : '#E9FBEA';
    const iconColor = green;

    function loggout(){
        signOut(auth)
        .then(() => {
            
        }).catch((error) => {
            console.log(error);
        });
    }

    return(
        <SafeAreaView style={{flex: 1, backgroundColor: background}}>
            <ImageBackground
                source={require('../../../../assets/frutas_fundo.png')}
                style={{flex: 1, resizeMode: 'cover'}}
                imageStyle={{opacity: 0.5}}
            >
                <View style={[styles.container,{marginTop: 'auto', marginBottom: 'auto', backgroundColor: 'transparent'}]}>                
                    <Image source={require("../../../../assets/logoWelcome.png")} style={styles.imageStyle}/>
                    <Text style={[styles.title, {color: green}]}>Configurações</Text>
                    <View style={styles.cardsContainer}>
                        <View style={styles.card}>
                            <MaterialCommunityIcons name="account-circle" size={36} color={iconColor} style={styles.icon}/>
                            <CustomCardO title="Dados Pessoais" onPress={()=> navigation.navigate("DataUser")} style={[styles.cardButton, {textAlign: 'center'}]}/>
                        </View>
                        <View style={styles.card}>
                            <FontAwesome5 name="heartbeat" size={32} color={iconColor} style={styles.icon}/>
                            <CustomCardO title="Dados Saúde" onPress={()=> navigation.navigate("HealthData")} style={[styles.cardButton, {textAlign: 'center'}]}/>
                        </View>
                        <View style={styles.card}>
                            <Ionicons name="leaf" size={36} color={iconColor} style={styles.icon}/>
                            <CustomCardO title="Conta" onPress={()=> navigation.navigate("AccountUser")} style={[styles.cardButton, {textAlign: 'center'}]}/>
                        </View>
                    </View>
                    <CustomButton title="Sair" onPress={loggout} modeButton={true} style={styles.logoutButton}/>
                </View>
            </ImageBackground>
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
        height: 140,
        width: 180,
        marginTop: 24,
        marginBottom: 8.5,
        alignSelf: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 18,
        textAlign: 'center',
        letterSpacing: 1,
    },
    cardsContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 24,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E9FBEA',
        borderRadius: 18,
        paddingVertical: 10,
        paddingHorizontal: 18,
        marginBottom: 14,
        width: '90%',
        shadowColor: '#2E8331',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    icon: {
        marginRight: 16,
        alignSelf: 'center',
    },
    cardButton: {
        flex: 1,
    },
    logoutButton: {
        marginTop: 18,
        backgroundColor: '#2E8331',
        borderRadius: 16,
        alignSelf: 'center',
        width: '70%',
    },
})