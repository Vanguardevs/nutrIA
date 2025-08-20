import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  useColorScheme,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getDatabase, onValue, ref, update } from "firebase/database";
import { auth } from "../../../database/firebase";
import CustomButton from "../../../components/shared/CustomButton";
import CustomField from "../../../components/shared/CustomField";
import CustomModal from "../../../components/shared/CustomModal";

export default function HealthData() {
  const navigation = useNavigation<any>();
  const colorScheme = useColorScheme();

  const background = colorScheme === "dark" ? "#1C1C1E" : "#F2F2F2";
  const textColor = colorScheme === "dark" ? "#F2F2F2" : "#1C1C1E";
  const cardBackground = colorScheme === "dark" ? "rgba(44,44,46,0.85)" : "rgba(255,255,255,0.85)";

  const [altura, setAltura] = useState<string>("");
  const [peso, setPeso] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  useEffect(() => {
    const db = getDatabase();
    const userId = auth.currentUser?.uid;
    const userRef = ref(db, `users/${userId}/`);

    const unsub = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setAltura(data.altura ? String(data.altura) : "");
        setPeso(data.peso ? String(data.peso) : "");
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  function handleAltura(input: string) {
    let alturaFormatada = input.replace(/[^0-9.,]/g, "");
    alturaFormatada = alturaFormatada.replace(",", ".");
    if (alturaFormatada.length > 4) alturaFormatada = alturaFormatada.slice(0, 4);
    setAltura(alturaFormatada);
  }

  function validarAltura(a: string) {
    if (!a) return false;
    const alturaNum = parseFloat(a.replace(",", "."));
    if (isNaN(alturaNum)) return false;
    return alturaNum >= 1.3 && alturaNum <= 2.1;
  }

  function handlePeso(input: string) {
    let pesoNumeros = input.replace(/[^0-9]/g, "");
    let pesoFormatado = pesoNumeros;
    if (pesoNumeros.length > 3) {
      pesoFormatado = pesoNumeros.slice(0, 3) + "," + pesoNumeros.slice(3, 6);
    }
    if (pesoFormatado.length > 6) pesoFormatado = pesoFormatado.slice(0, 6);
    setPeso(pesoFormatado);
  }

  function validarPeso(p: string) {
    if (!p) return false;
    const pesoNum = parseFloat(p.replace(",", "."));
    if (isNaN(pesoNum)) return false;
    return pesoNum >= 20 && pesoNum <= 400;
  }

  function handleSalvar() {
    setShowConfirm(true);
  }

  function confirmarSalvar() {
    setShowConfirm(false);

    if (!altura || !peso) {
      Alert.alert("Campos Vazios", "Por favor, preencha altura e peso.");
      return;
    }
    if (!validarAltura(altura)) {
      Alert.alert("Altura Inválida", "A altura deve estar entre 1,30 e 2,10 metros. Exemplo: 1,75");
      return;
    }
    if (!validarPeso(peso)) {
      Alert.alert("Peso Inválido", "O peso deve estar entre 20 e 400 kg. Exemplo: 70,5");
      return;
    }

    const db = getDatabase();
    const userId = auth.currentUser?.uid;
    if (!userId) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }
    const userRef = ref(db, `users/${userId}`);
    update(userRef, { altura, peso })
      .then(() => setShowSuccess(true))
      .catch(() => Alert.alert("Erro", "Não foi possível atualizar os dados. Tente novamente."));
  }

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: textColor }]}>Carregando dados...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: background }]}>
      <ImageBackground
        source={require("../../../../assets/frutas_fundo.png")}
        style={styles.imageBackground}
        imageStyle={{ opacity: 0.5 }}
      >
        <View style={[styles.container, { backgroundColor: cardBackground }]}>
          <Text style={[styles.title, { color: textColor }]}>Dados de Saúde</Text>
          <Text style={[styles.subtitle, { color: colorScheme === "dark" ? "#8E8E93" : "#6C757D" }]}>
            Atualize suas medidas corporais
          </Text>

          <CustomField
            title="Altura (metros)"
            placeholder="Ex: 1,75 (1,30 - 2,10)"
            value={altura}
            setValue={handleAltura}
            keyboardType="decimal-pad"
          />
          <CustomField
            title="Peso (kg)"
            placeholder="Ex: 70,5 (20 - 400 kg)"
            value={peso}
            setValue={handlePeso}
            keyboardType="decimal-pad"
          />

          <TouchableOpacity
            onPress={() => navigation.navigate("EditHealth")}
            style={[styles.medicalButton, { backgroundColor: colorScheme === "dark" ? "#2E8331" : "#28A745" }]}
          >
            <Text style={[styles.medicalButtonText, { color: "#FFFFFF" }]}>📋 Condições Médicas</Text>
          </TouchableOpacity>

          <View style={styles.buttonContainer}>
            <CustomButton
              title="Salvar Dados"
              modeButton={true}
              onPress={handleSalvar}
              size="large"
              style={{ width: "100%" }}
            />
          </View>
        </View>
      </ImageBackground>

      <CustomModal
        visible={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Confirmar alterações"
        message="Tem certeza que deseja salvar as alterações de saúde?"
        icon="warning"
        primaryButtonText="Confirmar"
        secondaryButtonText="Cancelar"
        onPrimaryPress={confirmarSalvar}
        onSecondaryPress={() => setShowConfirm(false)}
        showButtons={true}
      />

      <CustomModal
        visible={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          navigation.goBack();
        }}
        title="Sucesso"
        message="Dados de saúde atualizados com sucesso!"
        icon="checkmark-circle"
        primaryButtonText="OK"
        onPrimaryPress={() => {
          setShowSuccess(false);
          navigation.goBack();
        }}
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
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 8, textAlign: "center" },
  subtitle: { fontSize: 16, fontWeight: "400", marginBottom: 20, textAlign: "center" },
  medicalButton: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  medicalButtonText: { fontSize: 16, fontWeight: "600" },
  buttonContainer: { alignItems: "center", marginTop: 20 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: 18, fontWeight: "500" },
});
