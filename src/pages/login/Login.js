import { useColorScheme, View, Text, TouchableOpacity, SafeAreaView, ImageBackground, StyleSheet } from "react-native";
import { useState } from "react";
import { auth } from "../../database/firebase.js";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../../components/CustomButton";
import CustomField from "../../components/CustomField";

export default function LoginPag() {
  const colorScheme = useColorScheme();

  const background = colorScheme === "dark" ? "#1C1C1E" : "#F2F2F2";
  const texts = colorScheme === "dark" ? "#F2F2F2" : "#1C1C1E";

  const navegacao = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function logar() {
    if (email.length === 0 || password.length === 0) {
      alert("Erro", "Alguns dos campos de login estão vazios");
      console.log("Alguns dos campos de login estão vazios");
      return;
    }
    await signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        if (auth.currentUser.emailVerified == false) {
          alert("Verifique seu e-mail", "Você não verificou seu e-mail ainda");
          console.log("Você não verificou seu e-mail ainda");
          signOut(auth);
          return;
        }
        console.log("Sucesso ao fazer o login!");
      })
      .catch((error) => {
        if (error.code == "auth/invalid-credential") {
          alert("Inválida", "Senha Inválida!");
          console.log("Senha inválida");
          return;
        }
        if (error.code == "auth/invalid-email") {
          alert("Inválido", "Esse email não é válido");
          console.log("Esse tipo de texto não é email. Isso é inválido");
          return;
        }
        alert("Erro ao fazer login", "Verifique seu email e senha e tente novamente");
        console.log("Erro ao fazer login:", error);
      });
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: background }]}>
      <ImageBackground
        source={require("../../../assets/Frutas_home.png")}
        style={styles.imageBackground}
        imageStyle={{ opacity: 1 }} 
      >
        <View style={[styles.card, { backgroundColor: 'rgba(255,255,255,0.85)' }]}> 
          <CustomField
            title="Email"
            placeholder="Insira seu email"
            keyboardType="email-address"
            value={email}
            setValue={setEmail}
          />

          <CustomField
            title="Senha"
            placeholder="Insira sua senha"
            keyboardType="default"
            secureTextEntry
            value={password}
            setValue={setPassword}
          />

          <TouchableOpacity onPress={() => navegacao.push("ForgetPassword")} style={styles.forgotContainer}>
            <Text style={[styles.forgotText, { color: texts }]}>Esqueci minha senha</Text>
          </TouchableOpacity>

          <CustomButton
            title="Login"
            onPress={logar}
            modeButton={true}
            style={styles.loginButton}
          />

          <TouchableOpacity onPress={() => navegacao.push("Registro")} style={styles.registerContainer}>
            <Text style={{ fontSize: 15, color: texts }}>
              Não possui conta?{" "}
              <Text style={{ color: "green", fontWeight: "bold", fontSize: 17 }}>
                Crie agora
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "85%",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 5,
    alignItems: "center",
  },
  forgotContainer: {
    marginTop: 10,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  forgotText: {
    fontSize: 15,
  },
  loginButton: {
    width: "100%",
    marginBottom: 15,
  },
  registerContainer: {
    marginTop: 10,
    alignItems: "center",
  },
});
