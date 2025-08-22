import {
  View,
  SafeAreaView,
  ImageBackground,
  StyleSheet,
  Text,
  ScrollView,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import CustomField from "src/components/shared/CustomField";
import CustomPicker from "src/components/shared/CustomPicker";
import CustomButton from "src/components/shared/CustomButton";
import CustomModal from "src/components/shared/CustomModal";
import React, { useMemo, useCallback, useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useFoodsData } from "@/hooks/diary/useFoodsData";
import { useSaveDiaryAgenda } from "@/hooks/diary/useSaveDiaryAgenda";
import { useDiaryFoods } from "@/hooks/diary/useDiaryFoods";
import { useTimePicker } from "@/hooks/diary/useTimePicker";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  MainTabs: { screen: string };
  Diary: undefined;
};

export default function CreateDiary() {
  const colorScheme = useColorScheme();
  const backgroundH = colorScheme === "dark" ? "#1C1C1E" : "#F2F2F2";
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { alimentos, isLoadingFoods } = useFoodsData();
  const { saveAgenda, loading, isSaving } = useSaveDiaryAgenda();

  const {
    alimentosAgenda,
    alimentoInput,
    sugestoes,
    filtrarSugestoes,
    adicionarAlimento,
    removerAlimento,
  } = useDiaryFoods(alimentos, []);

  const { hora, setTime, isVisible, showTimePicker, hideTimePicker } = useTimePicker("");

  const [tipoRefeicao, setTipoRefeicao] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [agendaData, setAgendaData] = useState<any>(null);

  const alimentosOtimizados = useMemo(() => alimentos || [], [alimentos]);

  const handleTimeConfirm = useCallback(
    (time: Date) => {
      const hours = time.getHours().toString().padStart(2, "0");
      const minutes = time.getMinutes().toString().padStart(2, "0");
      setTime(`${hours}:${minutes}`);
      hideTimePicker();
    },
    [setTime, hideTimePicker]
  );

  const handleSugestaoPress = useCallback((item: any) => {
    filtrarSugestoes(item.descricao);
  }, [filtrarSugestoes]);

  const showSuccessModal = useCallback((data: any) => {
    setAgendaData(data);
    setShowModal(true);
  }, []);

  const hideSuccessModal = useCallback(() => {
    setShowModal(false);
    setAgendaData(null);
    setTipoRefeicao("");
    setTime("");
    navigation.navigate("MainTabs", { screen: "Diary" });
  }, [navigation, setTime]);

  const salvarAgendaHandler = useCallback(() => {
    saveAgenda(alimentosAgenda, hora, tipoRefeicao, showSuccessModal);
  }, [alimentosAgenda, hora, tipoRefeicao, saveAgenda, showSuccessModal]);

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
    [sugestoes.length, handleSugestaoPress]
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: backgroundH }]}>
      <ImageBackground source={require("@assets/Frutas_home.png")} style={styles.imgBackgound}>
        <View style={styles.container_items}>
          <CustomPicker
            label="Tipo de Refeição"
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
            title="Alimento"
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

          {alimentosAgenda.length > 0 && (
            <View style={{ width: "100%", marginVertical: 8 }}>
              {alimentosAgenda.map((alimento, idx) => (
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
                <Text style={{ color: "#222", fontSize: 18, height: 48, lineHeight: 48, textAlign: "center" }}>
                  {hora || "00:00"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <DateTimePickerModal isVisible={isVisible} mode="time" onConfirm={handleTimeConfirm} onCancel={hideTimePicker} />

          <CustomButton
            title={loading ? "Salvando..." : "Salvar"}
            onPress={salvarAgendaHandler}
            modeButton
            isLoading={loading || isLoadingFoods || isSaving}
            size="large"
            style={styles.saveButton}
          />
        </View>
      </ImageBackground>

      <CustomModal
        visible={showModal}
        title="Agenda Criada com Sucesso!"
        message={
          agendaData
            ? `Sua agenda de ${agendaData.tipoRefeicao} foi criada com sucesso!\n\n` +
              `📝 Refeição: ${agendaData.alimentos.join(", ")}\n` +
              `⏰ Horário: ${agendaData.horario}\n\n` +
              `Você receberá notificações diárias neste horário para lembrar de se alimentar.`
            : "Agenda criada com sucesso!"
        }
        onClose={hideSuccessModal}
        icon="checkmark-circle"
        iconColor="#28A745"
        iconBgColor="#D4EDDA"
        primaryButtonText="Entendi"
        onPrimaryPress={hideSuccessModal}
        showButtons
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
    width: "100%",
  },
  imgBackgound: { height: "100%", width: "100%" },
  saveButton: { width: "100%", marginTop: 20 },
});
