import { useNavigation } from "@react-navigation/native";
import { Text, View, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, Image } from "react-native";
import * as Animatable from 'react-native-animatable';

export default function Home(){
    const navigation = useNavigation();
    return(
        <SafeAreaView style={styles.container1}>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container1:{
        flex: 1,
        backgroundColor: 'green',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    container2:{
        backgroundColor: 'white',
        justifyContent: 'space-evenly',
        height: 250,
        width:'100%',
        borderTopRightRadius: 21,
        borderTopLeftRadius:21,
        marginTop:'40%',
        alignItems: 'center'
    },
    botao:{
        backgroundColor: 'blue',
        borderRadius: 26,
        height:80,
        width:160,
        justifyContent: 'center'
    },
    textoBotao:{
        fontSize:27,
        textAlign: 'center',
        color: 'white'
    },
    tituloWellcome:{
        fontSize: 30,
        fontWeight: 'bold'
    },
    imagem:{
        height: 220,
        width:270,
        borderRadius: 12
    }
})