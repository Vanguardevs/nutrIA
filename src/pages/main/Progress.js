import React from 'react';
import { View, Text, ImageBackground, SafeAreaView, StyleSheet } from 'react-native';


export default function Progress(){
    return(
        <SafeAreaView style={styles.container}>
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