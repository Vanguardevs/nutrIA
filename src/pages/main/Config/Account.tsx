import React, { useEffect, useState } from "react";
import { View, SafeAreaView, Text, StyleSheet, useColorScheme, Alert, ImageBackground } from "react-native";
import { getDatabase, onValue, ref, update } from "firebase/database";
import { sendPasswordResetEmail, updateEmail } from "firebase/auth";
import { auth } from "src/database/firebase";
import CustomField from "src/components/shared/CustomField";
import CustomButton from "src/components/shared/CustomButton";
import CustomModal from "src/components/shared/CustomModal";

export default function AccountUser() {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [confirmType, setConfirmType] = useState<"save" | "redefine" | "">("");

  const colorScheme = useColorScheme();
  const background = colorScheme === "dark" ? "#1C1C1E" : "#F2F2F2";
  const textColor = colorScheme === "dark" ? "#F2F2F2" : "#1C1C1E";
  const cardColor = colorScheme === "dark" ? "rgba(44,44,46,0.85)" : "rgba(255,255,255,0.85)";

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const db = getDatabase();
    const userRef = ref(db, `users/${user.uid}`);

    const unsubscribe = onValue(userRef, (resp) => {
      if (resp.exists()) {
        setEmail(resp.val()?.email || "");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  function handleRedefine() {
    setConfirmType("redefine");
    setShowConfirm(true);
  }

  function handleSave() {
    setConfirmType("save");
    setShowConfirm(true);
  }

  function RedefinePassword() {
    if (!email) {
      Alert.alert("Por favor, insira um email válido.");
      return;
    }
    if (!auth.currentUser?.email) {
      Alert.alert("Usuário não autenticado.");
      return;
    }
    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert("Email de redefinição de senha enviado com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao enviar email de redefinição de senha:", error);
        Alert.alert("Erro ao enviar email. Tente novamente mais tarde.");
      });
  }

  function updateEmailAddress() {
    if (!email) {
      Alert.alert("Por favor, insira um email válido.");
      return;
    }
    if (!auth.currentUser) {
      Alert.alert("Usuário não autenticado.");
      return;
    }

    const db = getDatabase();
    const userID = auth.currentUser.uid;
    const userRef = ref(db, `users/${userID}`);

    update(userRef, { email })
      .then(() => {
        return updateEmail(auth.currentUser!, email);
      })
      .then(() => {
        Alert.alert("Email atualizado com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao atualizar email:", error);
        Alert.alert("Erro ao atualizar email. Tente novamente mais tarde.");
      });
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Usuário não encontrado.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: background }]}>
      <ImageBackground
        source={require("@assets/frutas_fundo.png")}
        style={styles.imageBackground}
        imageStyle={{ opacity: 0.5 }}
      >
        <View style={[styles.container, { backgroundColor: cardColor }]}>
          <CustomField title="Email atual" placeholder="Seu email" value={email} setValue={setEmail} />

          <View style={styles.buttonsContainer}>
            <CustomButton
              title="Redefinir senha"
              onPress={handleRedefine}
              modeButton={false}
              style={styles.button}
            />
            <CustomButton
              title="Salvar alterações"
              onPress={handleSave}
              modeButton={true}
              size="large"
              style={{ width: "100%" }}
            />
          </View>
        </View>
      </ImageBackground>

      <CustomModal
        visible={showConfirm}
        onClose={() => setShowConfirm(false)}
        icon="warning"
        title={confirmType === "save" ? "Confirmar alterações" : "Redefinir senha"}
        message={
          confirmType === "save"
            ? "Tem certeza que deseja salvar as alterações?"
            : "Tem certeza que deseja redefinir sua senha?"
        }
        primaryButtonText="Confirmar"
        secondaryButtonText="Cancelar"
        onPrimaryPress={() => {
          setShowConfirm(false);
          if (confirmType === "save") updateEmailAddress();
          if (confirmType === "redefine") RedefinePassword();
        }}
        onSecondaryPress={() => setShowConfirm(false)}
        showButtons={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  imageBackground: { flex: 1, resizeMode: "cover", justifyContent: "center", alignItems: "center" },
  container: {
    width: "90%",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  buttonsContainer: { alignItems: "center", gap: 12, marginTop: 10 },
  button: { width: "80%", marginVertical: 6 },
});
