import {useState} from 'react';  
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Image, TouchableOpacity, Modal } from 'react-native';
import {NativeStackHeaderProps} from '@react-navigation/native-stack';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';



export default function Header(props) {

    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>

            <Text style={styles.title}>{props.options.title || ""}</Text>

            <View style={styles.opcoes}>

                <TouchableOpacity onPress={()=> navigation.navigate('Config')}>
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
        width: 37,
        height: 37,
        marginLeft: '0.67em',
        marginRight: '1,0em'
    },
    opcoes:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    }
})