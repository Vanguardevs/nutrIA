import { View, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../../components/CustomButton";
import CustomCard from "../../components/CustomCard"

export default function Settings(){

    const navigation = useNavigation();

    return(
        <View style={styles.container}>
            <Image source={require("../../../assets/logoWelcome.png")} style={styles.imageStyle}/>
            <CustomCard title="Dados Pessoais" onPress={()=>console.log(null)} nameImg="happy-outline"/>
            <CustomCard title="Conta" onPress={()=>console.log(null)} nameImg="person-circle-outline"/>
            <CustomCard title="Seguraça" onPress={()=>console.log(null)} nameImg="lock-closed"/>
            <CustomButton title="Sair" onPress={() => {navigation.replace("Login")}}/>
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