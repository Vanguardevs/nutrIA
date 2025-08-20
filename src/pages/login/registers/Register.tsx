import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  SafeAreaView,
  useColorScheme,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomField from "../../../components/shared/CustomField";
import CustomButton from "../../../components/shared/CustomButton";
import CustomPicker from "../../../components/shared/CustomPicker";
import CustomModal from "../../../components/shared/CustomModal";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function CreateUser() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  const background = colorScheme === "dark" ? "#121212" : "#F2F2F2";
  const textColor = colorScheme === "dark" ? "#FFFFFF" : "#1C1C1E";
  const glassColor = colorScheme === "dark" ? "rgba(0, 0, 0, 0.5)" : "rgba(255, 255, 255, 0.5)";
  const textMuted = colorScheme === "dark" ? "#A9A9A9" : "#808080";
  const inputBackground = colorScheme === "dark" ? "#1C1C1E" : "#fff";
  const inputBorderColor = colorScheme === "dark" ? "#333" : "#2E8331";
  const placeholderColor = colorScheme === "dark" ? "#888" : "#aaa";

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [sexo, setSexo] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<any>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    type: "info" as "info" | "success" | "error" | "warning",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const showModal = (
    title: string,
    message: string,
    type: "info" | "success" | "error" | "warning" = "info",
  ) => {
    setModalConfig({ title, message, type });
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const handleDateChange = (text: string) => {
    let formattedText = text.replace(/\D/g, "");

    if (formattedText.length > 2) {
      formattedText = formattedText.substring(0, 2) + "/" + formattedText.substring(2);
    }
    if (formattedText.length > 5) {
      formattedText = formattedText.substring(0, 5) + "/" + formattedText.substring(5, 9);
    }
    if (formattedText.length > 10) {
      formattedText = formattedText.substring(0, 10);
    }
    setDataNascimento(formattedText);
  };

  const parseDateFlexible = (s: string) => {
    if (!s || s.length !== 10) return null as null | { day: number; month: number; year: number };
    const parts = s.split("/");
    if (parts.length !== 3) return null;
    let [p1, p2, p3] = parts.map((n) => parseInt(n, 10));
    if ([p1, p2, p3].some((n) => Number.isNaN(n))) return null;
    const year = p3;
    let day: number, month: number;
    if (p2 > 12 && p1 >= 1 && p1 <= 12) {
      month = p1;
      day = p2;
    } else if (p1 > 12 && p2 >= 1 && p2 <= 12) {
      day = p1;
      month = p2;
    } else {
      day = p1;
      month = p2;
    }
    if (year < 1900 || year > new Date().getFullYear()) return null;
    if (month < 1 || month > 12) return null;
    const maxDay = new Date(year, month, 0).getDate();
    if (day < 1 || day > maxDay) return null;
    return { day, month, year };
  };

  const calcularIdade = (dataNascString: string) => {
    const parsed = parseDateFlexible(dataNascString);
    if (!parsed) return null as number | null;
    const { day, month, year } = parsed;
    const dataAtual = new Date();
    const dataNascimentoObj = new Date(year, month - 1, day);
    if (isNaN(dataNascimentoObj.getTime())) return null;
    let idadeCalculada = dataAtual.getFullYear() - dataNascimentoObj.getFullYear();
    const mesAtual = dataAtual.getMonth();
    const diaAtual = dataAtual.getDate();
    if (
      mesAtual < dataNascimentoObj.getMonth() ||
      (mesAtual === dataNascimentoObj.getMonth() && diaAtual < dataNascimentoObj.getDate())
    ) {
      idadeCalculada--;
    }
    return idadeCalculada;
  };

  function validateEmail(email: string) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function validatePassword(password: string) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
  }

  async function nextPage() {
    let errors: any = {};
    if (!nome) errors.nome = true;
    if (!email) errors.email = true;
    if (!password) errors.password = true;
    if (!dataNascimento) errors.dataNascimento = true;
    if (!sexo) errors.sexo = true;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      showModal("Campos Obrigatórios", "Por favor, preencha todos os campos para continuar.", "warning");
      return;
    }

    if (!validateEmail(email)) {
      setFieldErrors({ email: true });
      showModal("Email Inválido", "Digite um email válido no formato exemplo@email.com", "error");
      return;
    }

    if (!validatePassword(password)) {
      setFieldErrors({ password: true });
      showModal(
        "Senha Fraca",
        "A senha deve ter no mínimo 8 caracteres, incluindo pelo menos uma letra maiúscula, uma minúscula e um número.",
        "error",
      );
      return;
    }

    const idadeResultante = calcularIdade(dataNascimento);
    if (
      idadeResultante === null ||
      isNaN(idadeResultante as any) ||
      (idadeResultante as number) < 16 ||
      (idadeResultante as number) > 100
    ) {
      setFieldErrors({ dataNascimento: true });
      showModal(
        "Idade Inválida",
        "Você deve ter entre 16 e 100 anos para usar o aplicativo. Aceitamos DD/MM/AAAA ou MM/DD/AAAA.",
        "error",
      );
      return;
    }

    setLoading(true);
    setFieldErrors({});

    setTimeout(() => {
      setLoading(false);
      showModal(
        "Dados Válidos!",
        "Todos os dados foram validados com sucesso. Vamos para a próxima etapa!",
        "success",
      );
      setTimeout(() => {
        (navigation as any).navigate("HealthRegister", { nome, email, password, idade: idadeResultante, sexo });
      }, 1500);
    }, 1000);
  }

  const openDatePicker = () => setShowDatePicker(true);
  const closeDatePicker = () => setShowDatePicker(false);
  const handleConfirmDate = (date: Date) => {
    const dia = String(date.getDate()).padStart(2, "0");
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const ano = date.getFullYear();
    setDataNascimento(`${dia}/${mes}/${ano}`);
    setShowDatePicker(false);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: background }]}>
      <ImageBackground
        source={require("../../../../assets/Frutas_home.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={[styles.glassContainer, { backgroundColor: glassColor }]}>
              <Text style={[styles.headerTitle, { color: textColor }]}>Criar Conta</Text>
              <Text style={[styles.headerSubtitle, { color: textMuted }]}>
                Preencha seus dados para começar.
              </Text>

              <CustomField
                title="Nome Completo"
                value={nome}
                setValue={setNome}
                placeholder="Insira seu nome"
                autoComplete="name"
                textContentType="name"
              />
              <CustomField
                title="Email"
                value={email}
                setValue={setEmail}
                keyboardType="email-address"
                autoComplete="email"
                textContentType="emailAddress"
                placeholder="exemplo@email.com"
              />
              <CustomField
                title="Senha"
                value={password}
                setValue={setPassword}
                placeholder="Mínimo de 8 caracteres"
                secureTextEntry={!showPassword}
                autoComplete="password"
                textContentType="newPassword"
                rightIcon={
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Text style={{ color: "green", fontWeight: "bold" }}>
                      {showPassword ? "Ocultar" : "Mostrar"}
                    </Text>
                  </TouchableOpacity>
                }
              />

              <View style={styles.centeredPickerContainer}>
                <CustomPicker
                  label="Sexo"
                  selectedValue={sexo}
                  onValueChange={(value: string) => setSexo(value)}
                  options={[
                    { label: "Masculino", value: "masculino" },
                    { label: "Feminino", value: "feminino" },
                    { label: "Outro", value: "outro" },
                  ]}
                />
              </View>
              <Text style={[styles.headerSubtitle, { color: textColor, marginBottom: 4, fontWeight: "bold" }]}>
                Data de Nascimento
              </Text>
              {Platform.OS === "web" ? (
                <TextInput
                  style={[
                    styles.dateField,
                    {
                      borderColor: inputBorderColor,
                      color: textColor,
                      backgroundColor: inputBackground,
                      textAlign: "center",
                    },
                  ]}
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor={placeholderColor}
                  keyboardType="numeric"
                  value={dataNascimento}
                  onChangeText={handleDateChange}
                  maxLength={10}
                  inputMode="numeric"
                />
              ) : (
                <>
                  <TouchableOpacity
                    style={[
                      styles.dateField,
                      { borderColor: inputBorderColor, backgroundColor: inputBackground },
                    ]}
                    onPress={openDatePicker}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={{
                        color: dataNascimento ? textColor : placeholderColor,
                        fontSize: 16,
                        textAlign: "center",
                      }}
                    >
                      {dataNascimento ? dataNascimento : "DD/MM/AAAA"}
                    </Text>
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={showDatePicker}
                    mode="date"
                    onConfirm={handleConfirmDate}
                    onCancel={closeDatePicker}
                    maximumDate={new Date()}
                  />
                </>
              )}

              <View style={styles.buttonContainer}>
                <CustomButton title="Próximo" onPress={nextPage} modeButton={true} isLoading={loading} />
              </View>

              <TouchableOpacity onPress={() => (navigation as any).goBack()}>
                <Text style={[styles.loginText, { color: textMuted }]}>
                  Já tem uma conta? <Text style={{ color: "green", fontWeight: "bold" }}>Entre</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  safeArea: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  glassContainer: {
    padding: 25,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
  },
  centeredPickerContainer: {
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 70,
  },
  loginText: {
    textAlign: "center",
    fontSize: 14,
  },
  dateField: {
    height: 44,
    borderRadius: 18,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
    width: "95%",
    marginBottom: 10,
    backgroundColor: "#fff",
    alignSelf: "center",
  },
});
