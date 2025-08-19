import { useColorScheme, View, Text, TouchableOpacity, SafeAreaView, ImageBackground, StyleSheet } from "react-native";
import { useState } from "react";
import { auth } from "../../database/firebase.js";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../../components/CustomButton.js";
import CustomField from "../../components/shared/CustomField.js";
import CustomModal from "../../components/CustomModal.js";
import styles from "../../theme/styles.js";
import { getDatabase, ref, set, get, update } from "firebase/database";
import { app } from "../../database/firebase.js";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginPag() {
  const colorScheme = useColorScheme();

  const background = colorScheme === "dark" ? "#1C1C1E" : "#F2F2F2";
  const texts = colorScheme === "dark" ? "#F2F2F2" : "#1C1C1E";

  const navegacao = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    type: 'info'
  });

  const showModal = (title, message, type = 'info') => {
    setModalConfig({ title, message, type });
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  async function logar() {
    if (email.length === 0 || password.length === 0) {
      showModal("Campos Vazios", "Alguns dos campos de login estão vazios. Preencha todos os campos e tente novamente.", "warning");
      return;
    }
    
    try {
      // Tentar fazer login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log("Login bem-sucedido para:", user.email);
      console.log("Email verificado:", user.emailVerified);
      
      // Verificar se o email foi verificado
      if (!user.emailVerified) {
        console.log("Email não verificado - fazendo logout");
        showModal(
          "Email Não Verificado", 
          `Você ainda não verificou seu email.\n\n📧 Email: ${user.email}\n\n⚠️ IMPORTANTE: Verifique sua caixa de entrada (e pasta de spam) e clique no link de confirmação antes de fazer login.\n\n🔄 Após verificar o email, tente fazer login novamente.`, 
          "warning"
        );
      
        // Fazer logout para não manter o usuário logado
        await signOut(auth);
        return;
      }
      // Email verificado, login permitido
      update(ref(getDatabase(app), `users/${user.uid}`), {
        emailVerified: true
      });
      
      console.log("Email verificado - login permitido");
      // Após login bem-sucedido, verificar se há restrições pendentes

      // Mostrar modal de sucesso
      showModal("Login Realizado!", "Bem-vindo de volta! Você foi logado com sucesso.", "success");
      console.log("Sucesso ao fazer o login!");
      
      // Aguardar 3 segundos para o usuário ver o modal antes da navegação automática
      setTimeout(() => {
        // Limpar campos após o login
        setEmail("");
        setPassword("");
        // O App.js detectará automaticamente o usuário logado e navegará para AppTabs
      }, 3000);
      
    } catch (error) {
      console.log("Erro ao fazer login:", error);
      console.log("Código do erro:", error.code);
      
      if (error.code == "auth/invalid-credential") {
        showModal("Credenciais Inválidas", "Email ou senha incorretos. Verifique suas credenciais e tente novamente.", "error");
        return;
      }
      
      if (error.code == "auth/invalid-email") {
        showModal("Email Inválido", "O formato do email não é válido. Digite um email válido.", "error");
        return;
      }
      
      if (error.code == "auth/user-not-found") {
        showModal("Usuário Não Encontrado", "Não existe uma conta com este email. Verifique o email ou crie uma nova conta.", "error");
        return;
      }
      
      if (error.code == "auth/too-many-requests") {
        showModal("Muitas Tentativas", "Muitas tentativas de login. Aguarde alguns minutos antes de tentar novamente.", "warning");
        return;
      }
      
      showModal("Erro no Login", "Ocorreu um erro ao fazer login. Verifique sua conexão e tente novamente.", "error");
    }
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

      <CustomModal
        visible={modalVisible}
        onClose={hideModal}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
      />
    </SafeAreaView>
  );
}

