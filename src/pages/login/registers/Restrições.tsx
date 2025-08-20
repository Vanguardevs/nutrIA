import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  useColorScheme,
  Text,
  ImageBackground,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { auth } from "../../../database/firebase";
import CustomField from "../../../components/shared/CustomField";
import CustomButton from "../../../components/shared/CustomButton";
import CustomMultiPicker from "../../../components/shared/CustomMultiPicker";
import CustomModal from "../../../components/shared/CustomModal";

type Option = { id: string; name: string };

export default function Restricoes() {
  const colorScheme = useColorScheme();
  const background = colorScheme === "dark" ? "#1C1C1E" : "#F2F2F2";
  const navigate = useNavigation<any>();
  const route = useRoute<any>();

  const [Alergias, setAlergias] = useState<string>("");
  const [intolerancias, setIntolerancias] = useState<string[]>([]);
  const [Condicoes, setCondicoes] = useState<string[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showEmailConfirm, setShowEmailConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const intoleranciasOptions: Option[] = [
    { id: "Açucar", name: "Açucar" },
    { id: "Lactose", name: "Lactose" },
    { id: "Gluten", name: "Gluten" },
    { id: "Sacarose", name: "Sacarose" },
    { id: "Frutose", name: "Frutose" },
    { id: "Histamina", name: "Histamina" },
    { id: "Sulfito", name: "Sulfito" },
    { id: "Sorbitol", name: "Sorbitol" },
    { id: "Aditivos", name: "Aditivos" },
    { id: "Corantes", name: "Corantes" },
    { id: "Conservantes", name: "Conservantes" },
    { id: "Origem Animal", name: "Origem Animal" },
  ];

  const condicoesOptions: Option[] = [
    { id: "Diabetes", name: "Diabetes" },
    { id: "Hipertensão", name: "Hipertensão" },
    { id: "Obesidade", name: "Obesidade" },
    { id: "Anemia", name: "Anemia" },
    { id: "Câncer", name: "Câncer" },
    { id: "Doenças Cardiovasculares", name: "Doenças Cardiovasculares" },
    { id: "Doenças Renais", name: "Doenças Renais" },
    { id: "Doenças Hepáticas", name: "Doenças Hepáticas" },
    { id: "Doenças Gastrointestinais", name: "Doenças Gastrointestinais" },
    { id: "Doenças Autoimunes", name: "Doenças Autoimunes" },
    { id: "Doenças Respiratórias", name: "Doenças Respiratórias" },
    { id: "Doenças Neurológicas", name: "Doenças Neurológicas" },
    { id: "Doenças Endócrinas", name: "Doenças Endócrinas" },
    { id: "Doenças Infecciosas", name: "Doenças Infecciosas" },
    { id: "Doenças Psiquiátricas", name: "Doenças Psiquiátricas" },
    { id: "Doenças Musculoesqueléticas", name: "Doenças Musculoesqueléticas" },
    { id: "Doenças Dermatológicas", name: "Doenças Dermatológicas" },
  ];

  useEffect(() => {
    carregarDadosExistentes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const carregarDadosExistentes = () => {
    const userId = route?.params?.uid || auth.currentUser?.uid;
    if (!userId) {
      console.log("[Restricoes] Usuário não identificado");
      return;
    }
    const db = getDatabase();
    const userHealthRef = ref(db, `users/${userId}/`);
    const unsubscribe = onValue(
      userHealthRef,
      (snapshot) => {
        const data = snapshot.val();
        console.log("[Restricoes] Dados carregados:", data);
        if (data) {
          const alergiasValue = (data as any).alergias;
          setAlergias(alergiasValue === "Nenhuma" || !alergiasValue ? "" : alergiasValue);
          setIntolerancias((data as any).intolerancias || []);
          setCondicoes((data as any).condicoes || []);
        }
      },
      (error) => {
        console.error("[Restricoes] Erro ao carregar dados:", error);
      },
    );
    return unsubscribe;
  };

  async function handleSalvar() {
    if (!Alergias.trim() && intolerancias.length === 0 && Condicoes.length === 0) {
      // Permitimos salvar mesmo assim para registrar "Nenhuma" em alergias
    }
    setShowConfirm(true);
  }

  async function confirmarSalvar() {
    setLoading(true);
    try {
      const userId = route?.params?.uid || auth.currentUser?.uid;
      if (!userId) {
        Alert.alert("Erro", "Usuário não identificado. Faça o cadastro novamente.");
        setLoading(false);
        return;
      }
      const db = getDatabase();
      const healthData = {
        alergias: Alergias.trim() || "Nenhuma",
        intolerancias: Array.isArray(intolerancias) ? intolerancias : [],
        condicoes: Array.isArray(Condicoes) ? Condicoes : [],
        updatedAt: Date.now(),
        createdAt: Date.now(),
      };
      const healthRef = ref(db, `users/${userId}/health`);
      await set(healthRef, healthData);
      setShowSuccess(true);
    } catch (error) {
      setLoading(false);
      setShowConfirm(false);
      console.log("[Restricoes] Erro ao salvar restrições:", error);
      Alert.alert("Erro", "Não foi possível salvar as restrições. Tente novamente.");
    }
    setLoading(false);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: background }}>
      <ImageBackground
        source={require("../../../../assets/Frutas_home.png")}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20 }}
            keyboardShouldPersistTaps="handled"
          >
            <View
              style={{
                width: "100%",
                maxWidth: 420,
                backgroundColor: "rgba(255,255,255,0.97)",
                borderRadius: 18,
                padding: 28,
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 12,
                elevation: 4,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "bold",
                  color: "#2E8331",
                  textAlign: "center",
                  marginBottom: 8,
                  letterSpacing: 0.5,
                }}
              >
                Restrições Alimentares
              </Text>
              <Text
                style={{ fontSize: 16, color: "#555", textAlign: "center", marginBottom: 22, lineHeight: 22 }}
              >
                Informe alergias, intolerâncias e condições médicas para personalizar sua experiência.
              </Text>

              <CustomField
                title="Alergias"
                placeholder="Ex: Amendoim, frutos do mar..."
                value={Alergias}
                setValue={setAlergias}
              />

              <View style={{ marginVertical: 14, width: "100%", alignItems: "center" }}>
                <CustomMultiPicker
                  label="Intolerâncias"
                  options={intoleranciasOptions}
                  selectedItems={intolerancias}
                  onSelectedItemsChange={setIntolerancias}
                />
              </View>

              <View style={{ marginVertical: 14, width: "100%", alignItems: "center" }}>
                <CustomMultiPicker
                  label="Condições Médicas"
                  options={condicoesOptions}
                  selectedItems={Condicoes}
                  onSelectedItemsChange={setCondicoes}
                />
              </View>

              <View style={{ width: "100%", marginTop: 28, borderRadius: 12 }}>
                <CustomButton
                  title={loading ? "Salvando..." : "Salvar"}
                  modeButton={true}
                  size="large"
                  style={{
                    width: "100%",
                    elevation: 0,
                    shadowColor: "transparent",
                    shadowOpacity: 0,
                    shadowOffset: { width: 0, height: 0 },
                    shadowRadius: 0,
                    opacity: loading ? 0.6 : 1,
                  }}
                  onPress={handleSalvar}
                  isLoading={loading}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>

      <CustomModal
        visible={showConfirm}
        onClose={() => !loading && setShowConfirm(false)}
        title="Confirmar alterações"
        message="Tem certeza que deseja salvar as restrições alimentares?"
        icon="warning"
        primaryButtonText="Confirmar"
        secondaryButtonText="Cancelar"
        onPrimaryPress={async () => {
          setShowConfirm(false);
          await confirmarSalvar();
        }}
        onSecondaryPress={() => setShowConfirm(false)}
        showButtons={true}
      />

      <CustomModal
        visible={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          setShowEmailConfirm(true);
        }}
        title="Restrições salvas!"
        message="Suas restrições alimentares foram salvas com sucesso."
        icon="checkmark-circle"
        primaryButtonText="OK"
        onPrimaryPress={() => {
          setShowSuccess(false);
          setShowEmailConfirm(true);
        }}
        showButtons={true}
      />

      <CustomModal
        visible={showEmailConfirm}
        onClose={() => {
          setShowEmailConfirm(false);
          navigate.replace("Login");
        }}
        title="Confirme seu e-mail"
        message="Um e-mail de confirmação foi enviado. Verifique sua caixa de entrada e spam, clique no link de confirmação e só então faça login."
        icon="mail"
        primaryButtonText="OK"
        onPrimaryPress={() => {
          setShowEmailConfirm(false);
          navigate.replace("Login");
        }}
        showButtons={true}
      />
    </SafeAreaView>
  );
}
