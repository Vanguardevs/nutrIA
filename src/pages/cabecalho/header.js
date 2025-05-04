import {useState} from 'react';  
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Image, TouchableOpacity, Modal, useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons'



export default function Header(props) {

    const navigation = useNavigation();

    const colorSheme = useColorScheme();

    const backgoundH = colorSheme === 'dark'? "#1C1C1E" : "#F2F2F2"
    const backgoundIcons = colorSheme === 'dark'? "#F2F2F2" : "#1C1C1E"

    return (
        <SafeAreaView style={[styles.container,{backgroundColor: backgoundH}]}>

            <Text style={[styles.title,{color:backgoundIcons}]}>{props.options.title || ""}</Text>

            <View style={styles.opcoes}>

                <TouchableOpacity onPress={()=> navigation.navigate('Config')}>
                    <Ionicons name="options" size={30} color={backgoundIcons} style={styles.image}/>
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
        backgroundColor: '#f8f8f8',
        height: 70, 
        paddingHorizontal: 10, 
        borderBottomWidth: 1, 
        borderBottomColor: '#ccc',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: "4%"
    },
    image: {
        marginLeft: '0.67em',
        marginRight: '1,0em'
    },
    opcoes:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    }
})