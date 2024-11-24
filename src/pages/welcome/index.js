import { useNavigation } from "@react-navigation/native";
import { Text, View, TouchableOpacity, SafeAreaView, Image } from "react-native";
import * as Animatable from 'react-native-animatable';
import styles from "../../theme/styles";

export default function Welcome() {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.container1}>
            <View>
                <Image source={require('../../../assets/NutrIA_IMG.jpeg')} style={styles.imagem} />
            </View>
            <Animatable.View
                animation="fadeInUp"
                duration={1000}
                style={styles.container2}>
                <Text style={styles.tituloWellcome}>Bem Vindo</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate("Login")}
                    style={styles.botao}>
                    <View animation="bounceIn" duration={1500}>
                        <Text style={styles.textoBotao}>Começar</Text>
                    </View>
                </TouchableOpacity>
            </Animatable.View>
        </SafeAreaView>
    );
}
