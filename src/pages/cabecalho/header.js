import {useState} from 'react';  
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Image, TouchableOpacity, Modal, useColorScheme, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons'



export default function Header(props) {
    const navigation = useNavigation();
    const colorSheme = useColorScheme();
    const backgoundH = colorSheme === 'dark'? "#1C1C1E" : "#F2F2F2"
    const backgoundIcons = colorSheme === 'dark'? "#F2F2F2" : "#1C1C1E"

    const getTitleStyle = (title) => {
        switch (title) {
            case "Nutria":
                return [styles.title, styles.nutriaTitle, {color: backgoundIcons}];
            case "Agendas":
            case "Progresso":
                return [styles.title, styles.sectionTitle, {color: backgoundIcons}];
            default:
                return [styles.title, {color: backgoundIcons}];
        }
    };

    return (
        <SafeAreaView style={[styles.safeArea, {backgroundColor: backgoundH}]}> 
            <View style={styles.container}>
                <Text style={getTitleStyle(props.options && props.options.title ? props.options.title : "Nutria")}> 
                    {props.options && props.options.title ? 
                        (props.options.title === "Nutria" ? "NutrIA" : 
                         props.options.title === "Agendas" ? "Agenda" : 
                         props.options.title) : "NutrIA"}
                </Text>
                <View style={styles.opcoes}>
                    <TouchableOpacity onPress={()=> navigation.navigate('Config')}>
                        <Ionicons name="options" size={35} color={backgoundIcons} style={styles.image}/>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
} 

const styles = StyleSheet.create({
    safeArea: {
        width: '100%',
        backgroundColor: '#f8f8f8',
        zIndex: 1000,
        elevation: 3,
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        height: 70, 
        paddingHorizontal: 10,
        paddingBottom: 10,
        borderBottomWidth: 1, 
        borderBottomColor: '#ccc',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    title: {
        fontSize: 24,
        fontWeight: '500',
        marginLeft: "4%"
    },
    nutriaTitle: {
        fontWeight: '900',
        fontSize: 26
    },
    sectionTitle: {
        fontWeight: '700',
        fontSize: 24
    },
    image: {
        marginLeft: '0.67em',
        marginRight: '1.0em'
    },
    opcoes:{
        flexDirection: 'row',
        alignItems: 'center'
    }
})