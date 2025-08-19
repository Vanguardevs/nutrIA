import { SafeAreaView, StyleSheet, TouchableOpacity, View, Text, useColorScheme, ImageBackground, ActivityIndicator } from "react-native";
import CustomField from "../../../components/shared/CustomField";
import { useRoute, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import CustomPicker from "../../../components/shared/CustomPicker";
import CustomButton from "../../../components/CustomButton.js";
import CustomModal from "../../../components/CustomModal.js";
import { createUserWithEmailAndPassword, sendEmailVerification, signOut} from "firebase/auth";
import { auth, app } from "../../../database/firebase";
import {getDatabase, push, ref, set} from "firebase/database";
import styles from "../../../theme/styles";

export default function HealthRegister() {

    const colorScheme = useColorScheme();

    const background = colorScheme === 'dark'? "#1C1C1E" : "#F2F2F2";
    const texts = colorScheme === 'dark'? "#F2F2F2" : "#1C1C1E";

    const route = useRoute();
    const {nome, email, password, idade, sexo} = route.params;
    const navigation = useNavigation();

    const [altura, setAltura] = useState();
    const [peso, setPeso] = useState();
    const [objetivo, setObjetivo] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        title: '',
        message: '',
        type: 'info'
    });

    const showModal = (title, message, type = 'info') => {
        setModalConfig({ title, message, type });
        setModalVisible(true);
    };

    const hideModal = () => {
        setModalVisible(false);
        if (modalConfig.type === 'success' && modalConfig.title.includes('Cadastro Realizado')) {
            signOut(auth);
            navigation.goBack();
        }
    };

    function handleAltura(input) {
        let alturaFormatada = input.replace(/[^0-9]/g, '').slice(0, 3);
        let alturaFormatada2 = alturaFormatada;
        if (alturaFormatada.length > 1) {
            alturaFormatada2 = `${alturaFormatada.slice(0, 1)}.${alturaFormatada.slice(1, 3)}`;
        }
        setAltura(alturaFormatada2);
    }

    function validarAltura(altura) {
        if (!altura || altura.length === 0) return false;
        
        const alturaNum = parseFloat(altura.replace(',', '.'));
        if (isNaN(alturaNum)) return false;
        
        return alturaNum >= 1.30 && alturaNum <= 2.10;
    }

    function handlePeso(input) {
        // Permitir apenas números
        let pesoNumeros = input.replace(/[^0-9]/g, '');
        let pesoFormatado = pesoNumeros;
        // Só inserir vírgula após 3 dígitos
        if (pesoNumeros.length > 3) {
            pesoFormatado = pesoNumeros.slice(0, 3) + ',' + pesoNumeros.slice(3, 6);
        }
        // Limitar a 6 caracteres totais (incluindo vírgula)
        if (pesoFormatado.length > 6) pesoFormatado = pesoFormatado.slice(0, 6);
        setPeso(pesoFormatado);
    }

    function validarPeso(peso) {
        if (!peso || peso.length === 0) return false;
        
        const pesoNum = parseFloat(peso.replace(',', '.'));
        if (isNaN(pesoNum)) return false;
        
        return pesoNum >= 20 && pesoNum <= 400;
    }

    function cadastro(){
        if (loading) return;
        setLoading(true);
        try {
            // Remover validação obrigatória dos campos
            // Validar altura se preenchido
            if (altura && !validarAltura(altura)) {
                setLoading(false);
                showModal("Altura Inválida", "A altura deve estar entre 1,30 e 2,10 metros. Exemplo: 1,75", "error");
                return;
            }
            // Validar peso se preenchido
            if (peso && !validarPeso(peso)) {
                setLoading(false);
                showModal("Peso Inválido", "O peso deve estar entre 20 e 400 kg. Exemplo: 70,5", "error");
                return;
            }
            createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                console.log("Usuário cadastrado com sucesso!");
                const db = getDatabase(app);
                const userId = userCredential.user.uid;
                const userRef = ref(db, `users/${userId}`);
                
                const userData = {
                    nome,
                    email,
                    idade,
                    sexo,
                    createdAt: new Date().toISOString(),
                    emailVerified: false,
                    altura: altura || '',
                    peso: peso || '',
                    objetivo: objetivo || '',
                };

                try {
                    await set(userRef, userData);
                    console.log("Dados salvos em pendingUsers, users e healthData!");
                } catch (error) {
                    console.log("Erro ao salvar dados em pendingUsers, users/healthData:", error);
                }
                // Enviar email de verificação
                await sendEmailVerification(userCredential.user);
                // Navegar para a tela de restrições alimentares, passando o UID como parâmetro
                navigation.replace("Restrições", { uid: userId });
            })
            .catch((error)=>{
                setLoading(false);
                console.log("Erro ao cadastrar usuário:", error);
                if (error.code === "auth/email-already-in-use") {
                    showModal(
                        "Email Já Cadastrado", 
                        "Este email já está sendo usado por outra conta. Tente fazer login ou use um email diferente.", 
                        "error"
                    );
                } else if (error.code === "auth/weak-password") {
                    showModal(
                        "Senha Fraca", 
                        "A senha escolhida é muito fraca. Escolha uma senha com pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas e números.", 
                        "error"
                    );
                } else if (error.code === "auth/invalid-email") {
                    showModal(
                        "Email Inválido", 
                        "O formato do email não é válido. Digite um email válido.", 
                        "error"
                    );
                } else if (error.code === "auth/operation-not-allowed") {
                    showModal(
                        "Cadastro Desabilitado", 
                        "O cadastro de novos usuários está temporariamente desabilitado. Tente novamente mais tarde.", 
                        "error"
                    );
                } else {
                    showModal(
                        "Erro no Cadastro", 
                        "Ocorreu um erro ao criar sua conta. Verifique sua conexão e tente novamente.", 
                        "error"
                    );
                }
            });
        } catch (error) { 
            setLoading(false);
            console.log("Erro inesperado:", error);
            showModal(
                "Erro Inesperado", 
                "Ocorreu um erro inesperado. Tente novamente ou entre em contato com o suporte.", 
                "error"
            );
        }
    }

    return (
        <SafeAreaView style={[styles.hrContainer,{backgroundColor: background}]}>

            <ImageBackground
                source={require('../../../../assets/Frutas_home.png')}
                style={{flex: 1}}
                resizeMode="cover"
            >
                <View style={styles.hrForm}>
                    <CustomField 
                        title="Altura (metros)" 
                        placeholder="Ex: 1,75 (1,30 - 2,10)" 
                        value={altura} 
                        setValue={handleAltura} 
                        keyboardType='numeric'
                    />
                    <CustomField
                        title="Peso (kg)"
                        placeholder="Ex: 70,5 (20 - 200 kg)"
                        value={peso}
                        setValue={handlePeso}
                        keyboardType='numeric'
                    />
                    <CustomPicker
                        label="Meta"
                        selectedValue={objetivo}
                        onValueChange={(value)=> setObjetivo(value)}
                        options={[
                            { label: "Emagrecimento", value: "Emagrecimento" },
                            { label: "Saúde", value: "Saúde" },
                            { label: "Musculo", value: "Musculo" }
                        ]}
                    />
                    <View style={{width: '100%', alignItems: 'center'}}>
                        {loading ? (
                            <View style={{width: '100%', alignItems: 'center', marginTop: 20}}>
                                <ActivityIndicator size="large" color="#2E8331" />
                                <Text style={{marginTop: 10, color: '#2E8331', fontSize: 16}}>Cadastrando...</Text>
                            </View>
                        ) : (
                            <CustomButton
                                title="Cadastrar"
                                modeButton={true}
                                onPress={cadastro}
                                size="large"
                                style={{
                                    width: '100%',
                                    marginTop: 20,
                                    elevation: 0,
                                    shadowColor: 'transparent',
                                    shadowOpacity: 0,
                                    shadowOffset: { width: 0, height: 0 },
                                    shadowRadius: 0
                                }}
                                disabled={loading}
                            />
                        )}
                    </View>
                </View>
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

