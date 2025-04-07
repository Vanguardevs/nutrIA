import { useNavigation } from "@react-navigation/native";
import { ImageBackground, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Image } from "react-native";
import * as Animatable from 'react-native-animatable';
import styles from "../../theme/styles";


export default function Welcome() {
    
    const navigation = useNavigation();

    return (

        <SafeAreaView style={styles.welcomeContainer}>

            <ImageBackground
                source={require('../../../assets/fundoWelcome.png')}
                style={styles.welcomeBackground}
            >

                <View animation="bounceIn" duration={1500}>
                    <Text style={styles.welcomeText}>CONTROLE SUAS DIETAS</Text>
                </View>

                <View>
                    <Image source={require('../../../assets/logoWelcome.png')} style={styles.welcomeImage} />
                </View>

                {/* <Animatable.View
                animation="fadeInUp"
                duration={1000}
                style={styles.curtain}>
                <Text style={styles.welcomeTitle}>Bem Vindo</Text> */}

                <TouchableOpacity
                    onPress={async() => {await navigation.replace("Login");}}
                    style={styles.welcomeButton}>
                    <View animation="bounceIn" duration={1500}>
                        <Text style={styles.welcomeButtonText}>Começar</Text>
                    </View>
                </TouchableOpacity>

                {/* </Animatable.View> */}

            </ImageBackground>
        </SafeAreaView>

    );
}
