import { useNavigation } from "@react-navigation/native";
import { Text, View, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, Image } from "react-native";



export default function Wellcome(){
    const navigation = useNavigation();
    return(
        <SafeAreaView style={styles.container1}>
                <View>
                    <Image source={require('../../../assets/NutrIA_IMG.jpeg')} style={styles.imagem}/>
                </View>
                <View style={styles.container2}>
                    <Text style={styles.tituloWellcome}>Bem Vindo</Text>
                    <TouchableOpacity onPress={()=>navigation.navigate("Login")} style={styles.botao}>
                        <Text style={styles.textoBotao}>Começar</Text>
                    </TouchableOpacity>
                </View>
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
        height: 190,
        width:240,
        borderRadius: 12
    }
})