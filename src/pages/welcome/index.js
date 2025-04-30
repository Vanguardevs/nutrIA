import { useNavigation } from "@react-navigation/native";
import { ImageBackground, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Image } from "react-native";
import * as Animatable from 'react-native-animatable';
import styles from "../../theme/styles";
import CustomButton from "../../components/CustomButton";



export default function Welcome() {
    
    const navigation = useNavigation();

    return (

        <SafeAreaView style={styles.welcomeContainer}>

            <ImageBackground
                source={require('../../../assets/fundoWelcome.png')}
                style={styles.welcomeBackground}
            >


                <View animation="bounceIn" numberOflines={2}>
                    <Text style={styles.welcomeText}>CONTROLE SUAS DIETAS</Text>
                </View>

                <View>
                    <Image source={require('../../../assets/logoWelcome.png')} style={styles.welcomeImage} />
                </View>

                <CustomButton title="Começar" onPress={() => navigation.navigate("Login")} modeButton={true} />

            </ImageBackground>
        </SafeAreaView>

    );
}
