import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, ScrollView, ActivityIndicator, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getDatabase, onValue, ref, set } from "firebase/database";
import { auth } from "src/database/firebase";
import CustomField from "src/components/shared/CustomField";
import CustomMultiPicker from "src/components/shared/CustomMultiPicker";
import CustomButton from "src/components/shared/CustomButton";
import CustomModal from "src/components/shared/CustomModal";

export default function EditHealth() {
  const [alergias, setAlergias] = useState<string>("");
  const [intolerancias, setIntolerancias] = useState<string[]>([]);
  const [condicoes, setCondicoes] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [errorModal, setErrorModal] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  const navigation = useNavigation<any>();

  const intoleranciasOptions = [
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

  const condicoesOptions = [
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
    if (!auth.currentUser) {
      Alert.alert("Erro", "Usuário não autenticado. Faça login novamente.");
      setLoading(false);
      return;
    }

    const db = getDatabase();
    const userId = auth.currentUser.uid;
    const healthRef = ref(db, `users/${userId}/health`);

    const unsubscribe = onValue(
      healthRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setAlergias(data.alergias === "Nenhuma" ? "" : data.alergias || "");
          setIntolerancias(Array.isArray(data.intolerancias) ? data.intolerancias : []);
          setCondicoes(Array.isArray(data.condicoes) ? data.condicoes : []);
        }
        setLoading(false);
      },
      (error) => {
        console.error("[EditHealth] Erro ao carregar dados:", error);
        Alert.alert("Erro", `Não foi possível carregar os dados: ${error.message}`);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  function handleSalvar() {
    setShowConfirm(true);
  }

  async function confirmarSalvar() {
    setSaving(true);
    try {
      if (!auth.currentUser) {
        throw new Error("Usuário não autenticado");
      }
      const db = getDatabase();
      const userId = auth.currentUser.uid;

      const dadosParaSalvar = {
        alergias: alergias.trim() === "" ? "Nenhuma" : alergias.trim(),
        intolerancias: Array.isArray(intolerancias) ? intolerancias : [],
        condicoes: Array.isArray(condicoes) ? condicoes : [],
        updatedAt: new Date().toISOString(),
      };

      const healthRef = ref(db, `users/${userId}/health`);
      await set(healthRef, dadosParaSalvar);
      setShowConfirm(false);
      setShowSuccess(true);
    } catch (e) {
      console.error("Erro ao salvar restrições:", e);
      setErrorModal(true);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2E8331" />
        <Text style={{ marginTop: 16 }}>Carregando restrições...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F2F2F2" }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20 }}
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
            Condições Médicas
          </Text>
          <Text style={{ fontSize: 16, color: "#555", textAlign: "center", marginBottom: 22, lineHeight: 22 }}>
            Edite suas alergias, intolerâncias e condições médicas.
          </Text>
          <View style={{ width: "100%", position: "relative" }}>
            <CustomField
              title="Alergias"
              placeholder="Ex: Amendoim, frutos do mar..."
              value={alergias}
              setValue={setAlergias}
            />
          </View>
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
              selectedItems={condicoes}
              onSelectedItemsChange={setCondicoes}
            />
          </View>
          <CustomButton
            title={saving ? "Salvando..." : "Salvar"}
            onPress={() => setShowConfirm(true)}
            modeButton={true}
            size="large"
            style={{ width: "100%", opacity: saving ? 0.7 : 1 }}
            isLoading={saving}
          />
        </View>
      </ScrollView>

      <CustomModal
        visible={showConfirm}
        onClose={() => setShowConfirm(false)}
        icon="alert-circle"
        title="Confirmar"
        message="Você tem certeza que deseja salvar as alterações?"
        primaryButtonText="Salvar"
        onPrimaryPress={confirmarSalvar}
        secondaryButtonText="Cancelar"
        onSecondaryPress={() => setShowConfirm(false)}
      />

      <CustomModal
        visible={showSuccess}
        onClose={() => setShowSuccess(false)}
        icon="checkmark-circle"
        title="Sucesso"
        message="As alterações foram salvas com sucesso!"
        primaryButtonText="OK"
        onPrimaryPress={() => {
          setShowSuccess(false);
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
