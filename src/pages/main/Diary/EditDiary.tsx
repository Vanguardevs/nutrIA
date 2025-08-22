import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  SafeAreaView,
  ImageBackground,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  Text,
  ScrollView,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import CustomField from "src/components/shared/CustomField";
import CustomButton from "src/components/shared/CustomButton";
import CustomPicker from "src/components/shared/CustomPicker";
import CustomModal from "src/components/shared/CustomModal";

import { useFoodsData } from "src/hooks/diary/useFoodsData";
import { useSaveDiaryAgenda } from "src/hooks/diary/useSaveDiaryAgenda";
import { getDatabase, ref, remove } from "firebase/database";
import { auth } from "src/database/firebase";

export default function EditDiary() {
  const colorScheme = useColorScheme();
  const background = colorScheme === "dark" ? "#1C1C1E" : "#F2F2F2";

  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { id, alimentos: alimentosParam, hora, tipo_refeicao } = route.params as any;

  // --- Hooks ---
  const { alimentos, isLoadingFoods } = useFoodsData();
  const { saveAgenda, isSaving } = useSaveDiaryAgenda();

  // --- Local State ---
  const [tipoRefeicao, setTipoRefeicao] = useState<string>(tipo_refeicao || "");
  const [alimentosAgenda, setAlimentosAgenda] = useState<string[]>(
    Array.isArray(alimentosParam)
      ? alimentosParam.map((a: any) => (typeof a === "object" ? a.nome || a.descricao || String(a) : String(a)))
      : []
  );
  const [alimentoInput, setAlimentoInput] = useState("");
  const [sugestoes, setSugestoes] = useState<any[]>([]);
  const [editHora, setEditHora] = useState(hora || "");
  const [showAll, setShowAll] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // --- Food suggestion logic ---
  const filtrarSugestoes = useCallback(
    (texto: string) => {
      setAlimentoInput(texto);
      if (texto.length < 2) {
        setSugestoes([]);
        return;
      }
      const textoNormalizado = texto.normalize("NFD").replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase();
      const filtrados = alimentos
        .filter((item: any) => item.descricaoNormalizada?.includes(textoNormalizado))
        .slice(0, 6);
      setSugestoes(filtrados);
    },
    [alimentos]
  );

  const handleSugestaoPress = useCallback((item: any) => {
    setAlimentoInput(item.descricao);
    setSugestoes([]);
  }, []);

  // --- Add / Remove foods ---
  const adicionarAlimento = useCallback(() => {
    const valor = alimentoInput.trim();
    if (valor && !alimentosAgenda.includes(valor)) {
      setAlimentosAgenda((prev) => [...prev, valor]);
      setAlimentoInput("");
      setSugestoes([]);
    }
  }, [alimentoInput, alimentosAgenda]);

  const removerAlimento = useCallback((alimento: string) => {
    setAlimentosAgenda((prev) => prev.filter((a) => a !== alimento));
  }, []);

  // --- Time picker ---
  const showTimePicker = () => setTimePickerVisibility(true);
  const hideTimePicker = () => setTimePickerVisibility(false);

  // --- Save agenda ---
  const salvarAgenda = async () => {
    await saveAgenda(alimentosAgenda, editHora, tipoRefeicao, () => setShowModal(true));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigation.goBack();
  };

  // --- Delete agenda ---
  const confirmarExclusao = useCallback(async () => {
    try {
      const db = getDatabase();
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error("Usuário não autenticado");

      await remove(ref(db, `users/${userId}/diaries/${id}`));
      Alert.alert("Sucesso", "Agenda excluída com sucesso!");
      setShowDeleteModal(false);
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao excluir agenda:", error);
      Alert.alert("Erro", "Não foi possível excluir a agenda.");
    }
  }, [id, navigation]);

  // --- Render ---
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
      <ImageBackground source={require("@assets/Frutas_home.png")} style={styles.imgBackgound}>
        <View style={styles.container_items}>
          <CustomPicker
            label="Refeição"
            selectedValue={tipoRefeicao}
            onValueChange={setTipoRefeicao}
            options={[
              { label: "Café da Manhã", value: "Café da Manhã" },
              { label: "Almoço", value: "Almoço" },
              { label: "Jantar", value: "Jantar" },
              { label: "Lanche da Tarde", value: "Lanche da Tarde" },
            ]}
          />

          <CustomField
            title="Adicionar Alimento"
            placeholder="Ex: Omelete, Salada..."
            value={alimentoInput}
            setValue={filtrarSugestoes}
            onSubmitEditing={adicionarAlimento}
          />

          <TouchableOpacity onPress={adicionarAlimento} style={styles.addButton}>
            <Text style={styles.addButtonText}>Adicionar</Text>
          </TouchableOpacity>

          {alimentosAgenda.length > 0 && (
            <View style={{ width: "100%", marginVertical: 8 }}>
              {(showAll ? alimentosAgenda : alimentosAgenda.slice(0, 3)).map((alimento, idx) => (
                <View key={idx} style={styles.foodItem}>
                  <Text style={styles.foodIndex}>{idx + 1}.</Text>
                  <Text style={styles.foodName}>{alimento}</Text>
                  <TouchableOpacity onPress={() => removerAlimento(alimento)}>
                    <Ionicons name="close-circle" size={20} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              ))}
              {alimentosAgenda.length > 3 && (
                <TouchableOpacity onPress={() => setShowAll(!showAll)} style={{ alignSelf: "flex-end" }}>
                  <Text style={styles.showMoreText}>{showAll ? "Ver menos" : `Ver mais (${alimentosAgenda.length - 3})`}</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {sugestoes.length > 0 && (
            <ScrollView style={styles.suggestionsContainer}>
              {sugestoes.map((item, idx) => (
                <TouchableOpacity key={idx} onPress={() => handleSugestaoPress(item)} style={styles.suggestionItem}>
                  <Text style={styles.suggestionText}>{item.descricao}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          <View style={{ width: "100%", marginBottom: 8 }}>
            <Text style={styles.horarioLabel}>Horário</Text>
            <TouchableOpacity onPress={showTimePicker} activeOpacity={0.8} style={styles.timePickerButton}>
              <Ionicons name="time-outline" size={30} color="#2E8331" style={{ position: "absolute", left: 14, top: "50%", marginTop: -15, zIndex: 2 }} />
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center", height: 48 }}>
                <Text style={styles.timePickerText}>{editHora || "00:00"}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <DateTimePickerModal
            isVisible={isTimePickerVisible}
            mode="time"
            onConfirm={(time: Date) => {
              const hours = time.getHours().toString().padStart(2, "0");
              const minutes = time.getMinutes().toString().padStart(2, "0");
              setEditHora(`${hours}:${minutes}`);
              hideTimePicker();
            }}
            onCancel={hideTimePicker}
          />

          <CustomButton
            title={isSaving || isLoadingFoods ? "Salvando..." : "Salvar"}
            onPress={salvarAgenda}
            modeButton={true}
            size="large"
            style={{ width: "100%", marginTop: 16 }}
            isLoading={isSaving || isLoadingFoods}
          />

          <CustomButton
            title="Excluir"
            onPress={() => setShowDeleteModal(true)}
            variant="danger"
            size="large"
            style={{ width: "100%", marginTop: 12, marginBottom: 0 }}
            isLoading={false}
          />
        </View>
      </ImageBackground>

      {/* Success Modal */}
      <CustomModal
        visible={showModal}
        title="Agenda Atualizada!"
        message={`Sua agenda foi atualizada com sucesso!\n\n📝 Refeição: ${tipoRefeicao}\n🍽️ Alimentos: ${alimentosAgenda.join(
          ", "
        )}\n⏰ Horário: ${editHora}`}
        onClose={handleCloseModal}
        icon="checkmark-circle"
        iconColor="#28A745"
        iconBgColor="#D4EDDA"
        primaryButtonText="Entendi"
        onPrimaryPress={handleCloseModal}
        showButtons={true}
      />

      {/* Delete Confirmation Modal */}
      <CustomModal
        visible={showDeleteModal}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir esta agenda? Esta ação não pode ser desfeita."
        onClose={() => setShowDeleteModal(false)}
        icon="trash"
        iconColor="#DC3545"
        iconBgColor="#F8D7DA"
        primaryButtonText="Excluir"
        primaryButtonColor="#DC3545"
        onPrimaryPress={confirmarExclusao}
        secondaryButtonText="Cancelar"
        secondaryButtonColor="#C7C7CC"
        onSecondaryPress={() => setShowDeleteModal(false)}
        showButtons={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
  container_items: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginTop: "10%",
    marginBottom: "10%",
    padding: 20,
  },
  imgBackgound: { height: "100%", width: "100%" },
  addButton: { backgroundColor: "#2E8331", borderRadius: 8, paddingVertical: 12, alignItems: "center", marginTop: 6, marginBottom: 8, width: "100%" },
  addButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  foodItem: { flexDirection: "row", alignItems: "center", backgroundColor: "#E5E5EA", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 8 },
  foodIndex: { color: "#222", fontSize: 16, fontWeight: "bold", marginRight: 8 },
  foodName: { color: "#222", fontSize: 16, flex: 1 },
  showMoreText: { color: "#2E8331", fontWeight: "bold", fontSize: 14, marginBottom: 4 },
  suggestionsContainer: { width: "100%", backgroundColor: "#fff", borderRadius: 8, marginBottom: 12, maxHeight: 160, elevation: 2, shadowColor: "#000", shadowOpacity: 0.06, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 },
  suggestionItem: { padding: 10, borderBottomWidth: 1, borderColor: "#eee" },
  suggestionText: { color: "#222", fontSize: 15 },
  horarioLabel: { color: "#222", fontSize: 16, fontWeight: "bold", marginBottom: 4, marginLeft: 2, textAlign: "center", width: "100%" },
  timePickerButton: { width: "100%", backgroundColor: "#fff", borderColor: "#2E8331", borderWidth: 2, borderRadius: 8, height: 48, flexDirection: "row", alignItems: "center", paddingLeft: 40, marginBottom: 0 },
  timePickerText: { color: "#222", fontSize: 18, height: 48, lineHeight: 48, textAlign: "center", textAlignVertical: "center" },
});
