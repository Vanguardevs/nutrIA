import React from 'react';  
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Image, TouchableOpacity } from 'react-native';
import {NativeStackHeaderProps} from '@react-navigation/native-stack';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export default function Header(props) {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>{props.options.title || ""}</Text>
            <View style={styles.opcoes}>
                <TouchableOpacity>
                    <Image source={require('../../../assets/key.png')} style={styles.image}/>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image source={require('../../../assets/setting.png')} style={styles.image}/>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
} 


const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: StatusBar.currentHeight,
        backgroundColor: '#f8f8f8',
        height: 70, 
        paddingHorizontal: 10, 
        borderBottomWidth: 1, 
        borderBottomColor: '#ccc',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    image: {
        width: 37,
        height: 37,
        marginLeft: '0.67em'
    },
    opcoes:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    }
})