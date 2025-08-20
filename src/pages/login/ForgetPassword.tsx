import React, { useState } from "react";
import { SafeAreaView, View, useColorScheme, ImageBackground, StyleSheet, Text } from "react-native";
import CustomButton from "src/components/shared/CustomButton";
import CustomField from "src/components/shared/CustomField";
import CustomModal from "src/components/shared/CustomModal";
import { auth } from "src/database/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

export default function ForgetPassword() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation<any>();

  const background = colorScheme === "dark" ? "#1C1C1E" : "#F2F2F2";
  const texts = colorScheme === "dark" ? "#F2F2F2" : "#1C1C1E";
  const cardBackground = colorScheme === "dark" ? "#2C2C2E" : "#FFFFFF";

  const [email, setEmail] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
  });

  const showModal = (title: string, message: string) => {
    setModalConfig({ title, message });
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
    navigation.goBack();
  };

  async function resetPassword() {
    if (email.length === 0) {
      showModal("Campo Vazio", "Por favor, digite seu email para redefinir a senha.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      showModal(
        "Email Enviado! 📧",
        `Um email de redefinição de senha foi enviado para:\n\n${email}\n\nVerifique sua caixa de entrada (e pasta de spam) e siga as instruções no email.`,
      );
      setEmail("");
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        showModal("Email Não Encontrado", "Não existe uma conta cadastrada com este email.");
      } else if (error.code === "auth/invalid-email") {
        showModal("Email Inválido", "O formato do email não é válido.");
      } else if (error.code === "auth/too-many-requests") {
        showModal("Muitas Tentativas", "Aguarde alguns minutos antes de tentar novamente.");
      } else {
        showModal("Erro no Envio", "Não foi possível enviar o email de redefinição de senha. Tente novamente.");
      }
    }
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: background }]}>
      <ImageBackground source={require("@assets/Frutas_home.png")} style={styles.backgroundImage}>
        <View style={[styles.card, { backgroundColor: cardBackground }]}>
          <Text style={[styles.title, { color: texts }]}>Redefinir Senha</Text>
          <Text style={[styles.subtitle, { color: colorScheme === "dark" ? "#8E8E93" : "#6C757D" }]}>
            Digite seu email para receber um link de redefinição de senha.
          </Text>
          <CustomField
            title="Email"
            placeholder="Digite seu email"
            value={email}
            setValue={setEmail}
            keyboardType="email-address"
            autoComplete="email"
            textContentType="emailAddress"
            autoCapitalize="none"
          />
          <View style={styles.buttonContainer}>
            <CustomButton title="Enviar Email" onPress={resetPassword} modeButton={true} style={styles.button} />
          </View>
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

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  backgroundImage: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    width: "90%",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 20, textAlign: "center" },
  subtitle: { fontSize: 16, fontWeight: "400", marginBottom: 20, textAlign: "center" },
  buttonContainer: { alignItems: "center", marginTop: 16 },
  button: { width: "60%" },
});
