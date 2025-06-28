import React, { useState } from "react";
import { Text, TouchableOpacity, StyleSheet, View, SafeAreaView, useColorScheme, ImageBackground, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator} from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomField from "../../../components/CustomField"; 
import CustomButton from "../../../components/CustomButton.js";
import CustomPicker from "../../../components/CustomPicker";
import CustomModal from "../../../components/CustomModal.js";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function CreateUser() {
    const colorScheme = useColorScheme();
    const navigation = useNavigation();

    const background = colorScheme === 'dark' ? "#121212" : "#F2F2F2";
    const textColor = colorScheme === 'dark' ? "#FFFFFF" : "#1C1C1E";
    const glassColor = colorScheme === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)';
    const textMuted = colorScheme === 'dark' ? '#A9A9A9' : '#808080';

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [sexo, setSexo] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        title: '',
        message: '',
        type: 'info'
    });
    const [showDatePicker, setShowDatePicker] = useState(false);

    const showModal = (title, message, type = 'info') => {
        setModalConfig({ title, message, type });
        setModalVisible(true);
    };

    const hideModal = () => {
        setModalVisible(false);
    };

    const handleDateChange = (text) => {
        let formattedText = text.replace(/\D/g, ''); 

        if (formattedText.length > 2) {
            formattedText = formattedText.substring(0, 2) + '/' + formattedText.substring(2);
        }
        if (formattedText.length > 5) {
            formattedText = formattedText.substring(0, 5) + '/' + formattedText.substring(5, 9);
        }
        if (formattedText.length > 10) {
            formattedText = formattedText.substring(0, 10);
        }
        setDataNascimento(formattedText);
    };

    const calcularIdade = (dataNascString) => {
        if (!dataNascString || dataNascString.length !== 10) return null; 

        const partes = dataNascString.split('/');
        if (partes.length !== 3) return null;

        const [dia, mes, ano] = partes.map(Number);
        
        if (isNaN(dia) || isNaN(mes) || isNaN(ano)) {
            return null;
        }

        if (mes < 1 || mes > 12 || dia < 1 || dia > 31 || ano < 1900 || ano > new Date().getFullYear()) {
            return null;
        }

        const dataAtual = new Date();
        const dataNascimentoObj = new Date(ano, mes - 1, dia);

        if (isNaN(dataNascimentoObj.getTime())) { 
            return null;
        }

        let idadeCalculada = dataAtual.getFullYear() - dataNascimentoObj.getFullYear();
        const mesAtual = dataAtual.getMonth();
        const diaAtual = dataAtual.getDate();

        if (mesAtual < dataNascimentoObj.getMonth() || 
           (mesAtual === dataNascimentoObj.getMonth() && diaAtual < dataNascimentoObj.getDate())) {
            idadeCalculada--;
        }
        return idadeCalculada;
    };

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePassword(password) {
        // Pelo menos 8 caracteres, 1 maiúscula, 1 minúscula, 1 número
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
    }

    async function nextPage() {
        let errors = {};
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
            showModal("Senha Fraca", "A senha deve ter no mínimo 8 caracteres, incluindo pelo menos uma letra maiúscula, uma minúscula e um número.", "error");
            return;
        }

        const idadeResultante = calcularIdade(dataNascimento);
        if (idadeResultante === null || isNaN(idadeResultante) || idadeResultante < 16 || idadeResultante > 100) {
            setFieldErrors({ dataNascimento: true });
            showModal("Idade Inválida", "Você deve ter entre 16 e 100 anos para usar o aplicativo. Verifique se a data de nascimento está no formato DD/MM/AAAA.", "error");
            return;
        }

        setLoading(true);
        setFieldErrors({});
        
        // Simulação de verificação de e-mail duplicado (ideal: fazer no backend)
        setTimeout(() => {
            setLoading(false);
            showModal("Dados Válidos!", "Todos os dados foram validados com sucesso. Vamos para a próxima etapa!", "success");
            setTimeout(() => {
                navigation.navigate("HealthRegister", { nome, email, password, idade: idadeResultante, sexo });
            }, 1500);
        }, 1000);
    }

    const openDatePicker = () => setShowDatePicker(true);
    const closeDatePicker = () => setShowDatePicker(false);
    const handleConfirmDate = (date) => {
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const ano = date.getFullYear();
        setDataNascimento(`${dia}/${mes}/${ano}`);
        setShowDatePicker(false);
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: background }]}>
            <ImageBackground
                source={require('../../../../assets/Frutas_home.png')} 
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
                                        <Text style={{ color: 'green', fontWeight: 'bold' }}>{showPassword ? 'Ocultar' : 'Mostrar'}</Text>
                                    </TouchableOpacity>
                                }
                            />
                            
                            <View style={styles.centeredPickerContainer}>
                                <CustomPicker
                                    label="Sexo"
                                    selectedValue={sexo}
                                    onValueChange={(value) => setSexo(value)}
                                    options={[
                                        { label: "Masculino", value: "masculino" },
                                        { label: "Feminino", value: "feminino" },
                                        { label: "Outro", value: "outro" }
                                    ]}
                                />
                            </View>
                            <Text style={[styles.headerSubtitle, { color: textColor, marginBottom: 4, fontWeight: 'bold' }]}>Data de Nascimento</Text>
                            <TouchableOpacity
                                style={[styles.dateField, { borderColor: colorScheme === 'dark' ? '#333' : '#2E8331' }]}
                                onPress={openDatePicker}
                                activeOpacity={0.7}
                            >
                                <Text style={{ color: dataNascimento ? textColor : '#aaa', fontSize: 16, textAlign: 'center' }}>
                                    {dataNascimento ? dataNascimento : 'DD/MM/AAAA'}
                                </Text>
                            </TouchableOpacity>
                            <DateTimePickerModal
                                isVisible={showDatePicker}
                                mode="date"
                                onConfirm={handleConfirmDate}
                                onCancel={closeDatePicker}
                                maximumDate={new Date()}
                                headerTextIOS="Selecione sua data de nascimento"
                                cancelTextIOS="Cancelar"
                                confirmTextIOS="Confirmar"
                            />

                            <View style={styles.buttonContainer}>
                                {loading ? (
                                    <ActivityIndicator size="large" color="green" />
                                ) : (
                                    <CustomButton title="Próximo" onPress={nextPage} modeButton={true} />
                                )}
                            </View>

                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Text style={[styles.loginText, { color: textMuted }]}>
                                    Já tem uma conta? <Text style={{ color: 'green', fontWeight: 'bold' }}>Entre</Text>
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
                type={modalConfig.type}
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
        justifyContent: 'center',
        padding: 20,
    },
    glassContainer: {
        padding: 25,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
    },
    centeredPickerContainer: {
        alignItems: 'center',
        width: '100%',
        marginBottom: 15,
    },
    buttonContainer: {
        marginTop: 20,
        marginBottom: 20,
        paddingHorizontal: 70
    },
    loginText: {
        textAlign: 'center',
        fontSize: 14,
    },
    dateField: {
        height: 44,
        borderRadius: 18,
        paddingHorizontal: 16,
        borderWidth: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
        width: '95%',
        marginBottom: 10,
        backgroundColor: '#fff',
        alignSelf: 'center',
    },
});