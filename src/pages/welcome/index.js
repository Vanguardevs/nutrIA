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


                <View animation="bounceIn" numberOflines={2}>
                    <Text style={styles.welcomeText}>CONTROLE SUAS DIETAS</Text>
                </View>

                <View>
                    <Image source={require('../../../assets/logoWelcome.png')} style={styles.welcomeImage} />
                </View>

            <TouchableOpacity 
            onPress={() => navigation.replace("Login")}
            style={styles.welcomeButton}>
            
            <LinearGradient
            colors={['#2E8331', '#2F9933']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                
                <Text style={styles.welcomeButtonText}>Começar</Text>
            </LinearGradient>

            </TouchableOpacity>

            </ImageBackground>
        </SafeAreaView>

    );
}
