import { useNavigation } from "@react-navigation/native";
import { ImageBackground, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Image } from "react-native";
import * as Animatable from 'react-native-animatable';
import styles from "../../theme/styles";
import { LinearGradient } from 'expo-linear-gradient';



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
                style={styles.welcomeCurtain}>
                <Text style={styles.welcomeTitle}>Bem Vindo</Text> */}


            <TouchableOpacity 
            onPress={() => navigation.replace("Login")}>
            
            <LinearGradient
            colors={['#2E8331', '#2F9933']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.welcomeButton}>
                
                <Text style={styles.welcomeButtonText}>Começar</Text>
            </LinearGradient>

            </TouchableOpacity>


             {/* <TouchableOpacity
            onPress={async () => { await navigation.replace("Login"); }}
            style={styles.welcomeButton}>

                <View animation="bounceIn" durantion={1500}>
                    <Text style={styles.welcomeButtonText}>Começar</Text>
                </View>
            </TouchableOpacity> */}

                {/* </Animatable.View> */}

            </ImageBackground>
        </SafeAreaView>

    );
}
