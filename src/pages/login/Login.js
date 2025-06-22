import { useColorScheme, View, Text, TouchableOpacity, SafeAreaView, ImageBackground, StyleSheet } from "react-native";
import { useState } from "react";
import { auth } from "../../database/firebase.js";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../../components/CustomButton.js";
import CustomField from "../../components/CustomField";
import styles from "../../theme/styles.js";

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
    <SafeAreaView style={[styles.loginSafeArea, { backgroundColor: background }]}>
      <ImageBackground
        source={require("../../../assets/Frutas_home.png")}
        style={styles.loginImageBackground}
        imageStyle={{ opacity: 1 }}
      >
        <View style={[styles.loginCard, { backgroundColor: 'rgba(245, 245, 245, 1.00)' }]}>
          <CustomField
            title="Email"
            placeholder="Insira seu email"
            keyboardType="email-address"
            value={email}
            setValue={setEmail}
            autoComplete="email"
            textContentType="emailAddress"
            autoCapitalize="none"
          />

          <CustomField
            title="Senha"
            placeholder="Insira sua senha"
            keyboardType="default"
            secureTextEntry
            value={password}
            setValue={setPassword}
            autoComplete="password"
            textContentType="password"
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => navegacao.push("ForgetPassword")} style={styles.loginForgotContainer}>
            <Text style={[styles.loginForgotText, { color: texts }]}>Esqueci minha senha</Text>
          </TouchableOpacity>

          <CustomButton
            title="Login"
            onPress={logar}
            modeButton={true}
            style={styles.loginButton}
          />
          <TouchableOpacity onPress={() => navegacao.push("Register")} style={styles.loginRegisterContainer}>
            <Text style={{ fontSize: 15, color: texts }}>
              Não possui conta?{' '}
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

