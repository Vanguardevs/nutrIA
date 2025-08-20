import {
  View,
  SafeAreaView,
  ImageBackground,
  StyleSheet,
  Alert,
  useColorScheme,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import CustomField from "src/components/shared/CustomField";
import CustomButton from "src/components/shared/CustomButton";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { getDatabase, ref, remove, update } from "firebase/database";
import { auth } from "src/database/firebase";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import CustomPicker from "src/components/shared/CustomPicker";
import { Ionicons } from "@expo/vector-icons";
import CustomModal from "src/components/shared/CustomModal";
import { loadFoodsData } from "src/utils/foodsLoader";

export default function EditDiary() {
  const colorSheme = useColorScheme();

  const background = colorSheme === "dark" ? "#1C1C1E" : "#F2F2F2";
  const texts = colorSheme === "dark" ? "#F2F2F2" : "#1C1C1E";

  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { id, alimentos: alimentosParam, hora, refeicao, tipo_refeicao } = route.params as any;

  const [editRefeicao, setEditRefeicao] = useState(refeicao as string | undefined);
  const [editHora, setEditHora] = useState(hora as string | undefined);
  const [tipoRefeicao, setTipoRefeicao] = useState<string>(tipo_refeicao || "");
  const [alimentoInput, setAlimentoInput] = useState<string>("");

  const [alimentos, setAlimentos] = useState<any[]>([]);
  const [sugestoes, setSugestoes] = useState<any[]>([]);
  const [isLoadingFoods, setIsLoadingFoods] = useState<boolean>(true);

  const alimentosIniciais = (() => {
    if (Array.isArray(alimentosParam)) {
      return alimentosParam.map((alimento: any) => {
        if (typeof alimento === "object" && alimento !== null) {
          return alimento.nome || alimento.descricao || String(alimento);
        }
        return String(alimento);
      });
    }
    return [] as string[];
  })();

  const [alimentosAgenda, setAlimentosAgenda] = useState<string[]>(alimentosIniciais);
  const [showAll, setShowAll] = useState(false);

  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };
  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: undefined,
    });
  }, [navigation]);

  useEffect(() => {
    const loadFoods = async () => {
      try {
        setIsLoadingFoods(true);

        try {
          const foodsData = await loadFoodsData();
          setAlimentos(foodsData as any[]);
        } catch (cacheError) {
          console.warn("Cache de alimentos falhou, usando require como fallback:", cacheError);
          const foodsData: any[] = require("src/pages/main/foods.json");
          setAlimentos(foodsData);
        }
      } catch (e) {
        console.error("Erro ao carregar foods.json", e);
        Alert.alert("Erro", "Não foi possível carregar a base de dados de alimentos.");
        setAlimentos([]);
      } finally {
        setIsLoadingFoods(false);
      }
    };

    loadFoods();
  }, []);

  const alimentosOtimizados = useMemo(() => {
    if (!alimentos || alimentos.length === 0) return [] as any[];
    return alimentos;
  }, [alimentos]);

  const filtrarSugestoes = useCallback(
    (texto: string) => {
      setAlimentoInput(texto);
      if (texto.length < 2) {
        setSugestoes([]);
        return;
      }
      const textoNormalizado = texto
        .normalize("NFD")
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .toLowerCase();
      const filtrados = alimentosOtimizados
        .filter((item: any) => item.descricaoNormalizada && item.descricaoNormalizada.includes(textoNormalizado))
        .slice(0, 6);
      setSugestoes(filtrados);
    },
    [alimentosOtimizados],
  );

  const handleSugestaoPress = useCallback((item: any) => {
    setAlimentoInput(item.descricao);
    setSugestoes([]);
  }, []);

  const renderSugestao = useCallback(
    ({ item, index }: { item: any; index: number }) => (
      <TouchableOpacity
        key={index}
        onPress={() => handleSugestaoPress(item)}
        style={{
          padding: 10,
          borderBottomWidth: index !== sugestoes.length - 1 ? 1 : 0,
          borderColor: "#eee",
        }}
      >
        <Text style={{ color: "#222", fontSize: 15 }}>{item.descricao}</Text>
      </TouchableOpacity>
    ),
    [sugestoes.length, handleSugestaoPress],
  );

  function handleHora(input: string) {
    const apenasNumero = input.replace(/[^0-9]/g, "");
    let horaFormatada = apenasNumero;
    if (apenasNumero.length > 2) {
      horaFormatada = `${apenasNumero.slice(0, 2)}:${apenasNumero.slice(2, 4)}`;
    }
    setEditHora(horaFormatada);
  }

  const adicionarAlimento = useCallback(() => {
    const valor = alimentoInput.trim();
    if (valor.length > 0 && !alimentosAgenda.includes(valor)) {
      setAlimentosAgenda((prev) => [...prev, valor]);
      setAlimentoInput("");
      setSugestoes([]);
    }
  }, [alimentoInput, alimentosAgenda]);

  const removerAlimento = useCallback((alimento: string) => {
    setAlimentosAgenda((prev) => prev.filter((a) => a !== alimento));
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  async function excluirAgenda() {
    setShowDeleteModal(true);
  }

  async function confirmarExclusao() {
    try {
      const userID = auth.currentUser?.uid;
      if (!userID) {
        console.log("Usuário não encontrado");
        Alert.alert("Erro", "Não foi possível encontrar o usuário no banco. Tente Novamente!");
        setShowDeleteModal(false);
        return;
      }

      const db = getDatabase();
      const agendaRef = ref(db, `users/${userID}/diaries/${id}`);

      await remove(agendaRef).then(() => {
        setShowDeleteModal(false);
        setTimeout(() => navigation.goBack(), 500);
      });
    } catch (e) {
      console.log(e);
      setShowDeleteModal(false);
    }
  }

  const [isSaving, setIsSaving] = useState(false);

  async function salvarAgenda() {
    setIsSaving(true);
    try {
      const userID = auth.currentUser?.uid;
      if (!userID) {
        console.log("Usuário não encontrado");
        Alert.alert("Erro", "Não foi possível encontrar o usuário no banco. Tente Novamente!");
        return;
      }

      const db = getDatabase();
      const agendaRef = ref(db, `users/${userID}/diaries/${id}`);

      await update(agendaRef, {
        alimentos: alimentosAgenda,
        hora: editHora,
        tipo_refeicao: tipoRefeicao,
      }).then(() => {
        setShowModal(true);
      });
    } catch (e) {
      console.log(e);
      Alert.alert("Erro", "Não foi possível salvar. Tente Novamente!");
    } finally {
      setIsSaving(false);
    }
  }

  function handleCloseModal() {
    setShowModal(false);
    navigation.goBack();
  }

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

          <TouchableOpacity
            onPress={adicionarAlimento}
            style={{
              backgroundColor: "#2E8331",
              borderRadius: 8,
              paddingVertical: 12,
              alignItems: "center",
              marginTop: 6,
              marginBottom: 8,
              width: "100%",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Adicionar</Text>
          </TouchableOpacity>

          {Array.isArray(alimentosAgenda) && alimentosAgenda.length > 0 && (
            <View style={{ width: "100%", marginVertical: 8 }}>
              {(showAll ? alimentosAgenda : alimentosAgenda.slice(0, 3)).map((alimento, idx) => (
                <View
                  key={idx}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#E5E5EA",
                    borderRadius: 10,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    marginBottom: 8,
                  }}
                >
                  <Text style={{ color: "#222", fontSize: 16, fontWeight: "bold", marginRight: 8 }}>
                    {idx + 1}.
                  </Text>
                  <Text style={{ color: "#222", fontSize: 16, flex: 1 }}>{alimento}</Text>
                  <TouchableOpacity onPress={() => removerAlimento(alimento)} style={{ marginLeft: 6 }}>
                    <Ionicons name="close-circle" size={20} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              ))}
              {alimentosAgenda.length > 3 && (
                <TouchableOpacity
                  onPress={() => setShowAll(!showAll)}
                  style={{ alignSelf: "flex-end", marginBottom: 4 }}
                >
                  <Text style={{ color: "#2E8331", fontWeight: "bold", fontSize: 14 }}>
                    {showAll ? "Ver menos" : `Ver mais (${alimentosAgenda.length - 3})`}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {sugestoes.length > 0 && (
            <View
              style={{
                width: "100%",
                backgroundColor: "#fff",
                borderRadius: 8,
                marginBottom: 12,
                marginTop: 2,
                maxHeight: 160,
                elevation: 2,
                alignSelf: "center",
                shadowColor: "#000",
                shadowOpacity: 0.06,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 4,
              }}
            >
              <ScrollView
                style={{ maxHeight: 160 }}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={false}
              >
                {sugestoes.map((item, idx) => renderSugestao({ item, index: idx }))}
              </ScrollView>
            </View>
          )}

          <View style={{ width: "100%", marginBottom: 8 }}>
            <Text
              style={{
                color: "#222",
                fontSize: 16,
                fontWeight: "bold",
                marginBottom: 4,
                marginLeft: 2,
                textAlign: "center",
                width: "100%",
              }}
            >
              Horário
            </Text>
            <TouchableOpacity
              onPress={showTimePicker}
              activeOpacity={0.8}
              style={{
                width: "100%",
                backgroundColor: "#fff",
                borderColor: "#2E8331",
                borderWidth: 2,
                borderRadius: 8,
                height: 48,
                flexDirection: "row",
                alignItems: "center",
                paddingLeft: 40,
                marginBottom: 0,
              }}
            >
              <Ionicons
                name="time-outline"
                size={30}
                color="#2E8331"
                style={{ position: "absolute", left: 14, top: "50%", marginTop: -15, zIndex: 2 }}
              />
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center", height: 48 }}>
                <Text
                  style={{
                    color: "#222",
                    fontSize: 18,
                    height: 48,
                    lineHeight: 48,
                    textAlign: "center",
                    textAlignVertical: "center",
                  }}
                >
                  {editHora || "00:00"}
                </Text>
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
            title={isSaving ? "Salvando..." : "Salvar"}
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
      <CustomModal
        visible={showModal}
        title="Agenda Atualizada!"
        message={
          `Sua agenda foi atualizada com sucesso!\n\n` +
          `📝 Refeição: ${tipoRefeicao}\n` +
          `🍽️ Alimentos: ${alimentosAgenda.join(", ")}\n` +
          `⏰ Horário: ${editHora}`
        }
        onClose={handleCloseModal}
        icon="checkmark-circle"
        iconColor="#28A745"
        iconBgColor="#D4EDDA"
        primaryButtonText="Entendi"
        onPrimaryPress={handleCloseModal}
        showButtons={true}
      />
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
  container: {
    flex: 1,
    justifyContent: "center",
  },
  container_items: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginTop: "10%",
    marginBottom: "10%",
    padding: 20,
  },
  imgBackgound: {
    height: "100%",
    width: "100%",
  },
});
