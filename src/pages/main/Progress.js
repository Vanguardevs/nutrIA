import React from 'react';
import { View, Text, ImageBackground, SafeAreaView, StyleSheet, useColorScheme } from 'react-native';


export default function Progress(){

    const colorSheme = useColorScheme();
    
    const backgoundH = colorSheme === 'dark'? "#1C1C1E" : "#F2F2F2"
    const backgoundIcons = colorSheme === 'dark'? "#F2F2F2" : "#1C1C1E"

    return(
        <SafeAreaView style={[styles.container,{backgroundColor:backgoundH}]}>
            <ImageBackground source={require('../../../assets/Frutas_home.png')} style={styles.homeBackground}>

            </ImageBackground>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    homeBackground: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%',
        width: '100%',
    },
})