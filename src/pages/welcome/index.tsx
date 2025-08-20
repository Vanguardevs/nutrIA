import { useNavigation } from "@react-navigation/native";
import { useColorScheme, ImageBackground, Text, View, SafeAreaView, Image } from "react-native";
import styles from "../../theme/styles";
import CustomButton from "../../components/shared/CustomButton";

export default function Welcome() {
  const colorScheme = useColorScheme();
  const background = colorScheme === "dark" ? "#1C1C1E" : "#F2F2F2";
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={[styles.welcomeContainer, { backgroundColor: background }]}>
      <ImageBackground source={require("../../../assets/Frutas_home.png")} style={styles.welcomeBackground}>
        <View>
          <Text style={styles.welcomeText}>CONTROLE SUAS DIETAS</Text>
        </View>

        <View>
          <Image source={require("../../../assets/logoWelcome.png")} style={styles.welcomeImage} />
        </View>

        <CustomButton
          title="Começar"
          onPress={() => navigation.navigate("Login")}
          modeButton={true}
          size="large"
          style={{ width: "100%", marginTop: 20 }}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}
