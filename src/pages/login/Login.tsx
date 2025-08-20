import React, { useState } from "react";
import { useColorScheme, View, Text, TouchableOpacity, SafeAreaView, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getDatabase, ref, update } from "firebase/database";
import CustomButton from "src/components/shared/CustomButton";
import CustomField from "src/components/shared/CustomField";
import CustomModal from "src/components/shared/CustomModal";
import styles from "src/theme/styles";
import { auth, app } from "src/database/firebase";

export default function LoginPag() {
  const colorScheme = useColorScheme();
  const navegacao = useNavigation<any>();

  const background = colorScheme === "dark" ? "#1C1C1E" : "#F2F2F2";
  const texts = colorScheme === "dark" ? "#F2F2F2" : "#1C1C1E";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
  });

  const showModal = (title: string, message: string) => {
    setModalConfig({ title, message });
    setModalVisible(true);
  };

  const hideModal = () => setModalVisible(false);

  async function logar() {
    if (email.length === 0 || password.length === 0) {
      showModal(
        "Campos Vazios",
        "Alguns dos campos de login estão vazios. Preencha todos os campos e tente novamente.",
      );
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        showModal(
          "Email Não Verificado",
          `Você ainda não verificou seu email.\n\n📧 Email: ${user.email}\n\nVerifique sua caixa de entrada (e pasta de spam) e clique no link de confirmação antes de fazer login.`,
        );
        await signOut(auth);
        return;
      }

      await update(ref(getDatabase(app), `users/${user.uid}`), { emailVerified: true });

      showModal("Login Realizado!", "Bem-vindo de volta! Você foi logado com sucesso.");

      setTimeout(() => {
        setEmail("");
        setPassword("");
      }, 1500);
    } catch (error: any) {
      if (error.code == "auth/invalid-credential") {
        showModal("Credenciais Inválidas", "Email ou senha incorretos. Verifique e tente novamente.");
        return;
      }
      if (error.code == "auth/invalid-email") {
        showModal("Email Inválido", "O formato do email não é válido.");
        return;
      }
      if (error.code == "auth/user-not-found") {
        showModal("Usuário Não Encontrado", "Não existe uma conta com este email.");
        return;
      }
      if (error.code == "auth/too-many-requests") {
        showModal("Muitas Tentativas", "Aguarde alguns minutos antes de tentar novamente.");
        return;
      }
      showModal("Erro no Login", "Ocorreu um erro ao fazer login. Tente novamente.");
    }
  }

  return (
    <SafeAreaView style={[styles.loginSafeArea, { backgroundColor: background }]}>
      <ImageBackground
        source={require("@assets/Frutas_home.png")}
        style={styles.loginImageBackground}
        imageStyle={{ opacity: 1 }}
      >
        <View style={[styles.loginCard, { backgroundColor: "rgba(245, 245, 245, 1.00)" }]}>
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

          <CustomButton title="Login" onPress={logar} modeButton={true} style={styles.loginButton} />
          <TouchableOpacity onPress={() => navegacao.push("Register")} style={styles.loginRegisterContainer}>
            <Text style={{ fontSize: 15, color: texts }}>
              Não possui conta?{" "}
              <Text style={{ color: "green", fontWeight: "bold", fontSize: 17 }}>Crie agora</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <CustomModal
        visible={modalVisible}
        onClose={hideModal}
        title={modalConfig.title}
        message={modalConfig.message}
      />
    </SafeAreaView>
  );
}
