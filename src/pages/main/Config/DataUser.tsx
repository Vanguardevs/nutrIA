import React, { useEffect, useState } from "react";
import { View, SafeAreaView, Text, Alert, useColorScheme, StyleSheet, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ref, onValue, getDatabase, update } from "firebase/database";
import { auth } from "src/database/firebase";
import CustomButton from "src/components/shared/CustomButton";
import CustomField from "src/components/shared/CustomField";
import CustomPicker from "src/components/shared/CustomPicker";
import CustomModal from "src/components/shared/CustomModal";

export default function DataUser() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation<any>();

  const background = colorScheme === "dark" ? "#1C1C1E" : "#F2F2F2";
  const textColor = colorScheme === "dark" ? "#F2F2F2" : "#1C1C1E";
  const cardBackground = colorScheme === "dark" ? "rgba(44,44,46,0.85)" : "rgba(255,255,255,0.85)";

  const [nome, setNome] = useState<string>("");
  const [idade, setIdade] = useState<string>("");
  const [objetivo, setObjetivo] = useState<string>("");
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [successModal, setSuccessModal] = useState<boolean>(false);
  const [errorModal, setErrorModal] = useState<boolean>(false);

  useEffect(() => {
    const db = getDatabase();
    const userID = auth.currentUser?.uid;
    const userRef = ref(db, `users/${userID}`);

    const unsub = onValue(userRef, (resp) => {
      const data = resp.val();
      if (data) {
        setNome(data.nome || "");
        setIdade(data.idade ? String(data.idade) : "");
        setObjetivo(data.objetivo || "");
      }
    });
    return () => unsub();
  }, []);

  function handleSalvar() {
    setShowConfirm(true);
  }

  function confirmarSalvar() {
    const db = getDatabase();
    const userID = auth.currentUser?.uid;
    const userRef = ref(db, `users/${userID}`);

    if (!nome || !idade || !objetivo) {
      setErrorModal(true);
      return;
    }

    const idadeNum = parseInt(idade, 10);
    if (isNaN(idadeNum) || idadeNum < 16 || idadeNum > 100) {
      Alert.alert("Idade Inválida", "Por favor, insira uma idade válida entre 16 e 100 anos.");
      return;
    }

    update(userRef, { nome, idade: idadeNum, objetivo })
      .then(() => {
        setShowConfirm(false);
        setSuccessModal(true);
      })
      .catch(() => setErrorModal(true));
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: background }]}>
      <ImageBackground
        source={require("@assets/frutas_fundo.png")}
        style={styles.imageBackground}
        imageStyle={{ opacity: 0.5 }}
      >
        <View style={[styles.container, { backgroundColor: cardBackground }]}>
          <Text style={[styles.title, { color: textColor }]}>Dados Pessoais</Text>
          <Text style={[styles.subtitle, { color: colorScheme === "dark" ? "#8E8E93" : "#6C757D" }]}>
            Atualize suas informações pessoais
          </Text>

          <CustomField title="Nome Completo" placeholder="Seu nome completo" value={nome} setValue={setNome} />
          <CustomField
            title="Idade"
            placeholder="Sua idade em anos"
            value={idade}
            setValue={setIdade}
            keyboardType="numeric"
          />

          <View style={styles.centered}>
            <CustomPicker
              label="Objetivo"
              selectedValue={objetivo}
              onValueChange={(value: string) => setObjetivo(value)}
              options={[
                { label: "Emagrecimento", value: "Emagrecimento" },
                { label: "Musculo", value: "Musculo" },
                { label: "Saúde", value: "Saúde" },
              ]}
            />
          </View>

          <View style={styles.centered}>
            <CustomButton
              title="Salvar"
              onPress={handleSalvar}
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
        title="Confirmar"
        message="Você tem certeza que deseja salvar as alterações?"
        primaryButtonText="Confirmar"
        onPrimaryPress={confirmarSalvar}
        secondaryButtonText="Cancelar"
        onSecondaryPress={() => setShowConfirm(false)}
        showButtons={true}
      />

      <CustomModal
        visible={successModal}
        onClose={() => setSuccessModal(false)}
        icon="checkmark-circle"
        title="Sucesso"
        message="As alterações foram salvas com sucesso!"
        primaryButtonText="OK"
        onPrimaryPress={() => {
          setSuccessModal(false);
          navigation.goBack();
        }}
      />

      <CustomModal
        visible={errorModal}
        onClose={() => setErrorModal(false)}
        icon="alert-circle"
        title="Erro"
        message="Ocorreu um erro ao salvar as alterações."
        primaryButtonText="OK"
        onPrimaryPress={() => setErrorModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  imageBackground: { flex: 1, resizeMode: "cover", justifyContent: "center", alignItems: "center" },
  container: {
    width: "90%",
    padding: 20,
    borderRadius: 16,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 20, textAlign: "center" },
  subtitle: { fontSize: 16, fontWeight: "400", marginBottom: 20, textAlign: "center" },
  centered: { alignItems: "center", marginVertical: 12, width: "100%" },
});
