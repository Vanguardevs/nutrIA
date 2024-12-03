import { useNavigation } from "@react-navigation/native";
import { Text, View, TouchableOpacity, SafeAreaView, Image } from "react-native";
import * as Animatable from 'react-native-animatable';
import styles from "../../theme/styles";


export default function Welcome() {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.welcomeContainer}>
            <View>
                <Image source={require('../../../assets/Nutria.png')} style={styles.welcomeImage} />
            </View>
            <Animatable.View
                animation="fadeInUp"
                duration={1000}
                style={styles.curtain}>
                <Text style={styles.welcomeTitle}>Bem Vindo</Text>

                <TouchableOpacity
                    onPress={() => navigation.replace("Login")}
                    style={styles.button}>
                    <View animation="bounceIn" duration={1500}>
                        <Text style={styles.welcomeButtonText}>Começar</Text>
                    </View>
                </TouchableOpacity>
            </Animatable.View>
        </SafeAreaView>
    );
}
