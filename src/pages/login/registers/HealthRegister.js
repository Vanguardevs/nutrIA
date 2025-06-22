import { SafeAreaView, StyleSheet, TouchableOpacity, View, Text, useColorScheme, ImageBackground } from "react-native";
import CustomField from "../../../components/CustomField";
import { useRoute, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import CustomPicker from "../../../components/CustomPicker";
import CustomButton from "../../../components/CustomButton.js";
import CustomModal from "../../../components/CustomModal.js";
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth";
import { auth, app } from "../../../database/firebase";
import {getDatabase, ref, set} from "firebase/database";
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
    };

    function cadastro(){
        try {
            if(altura == 0 || peso == 0 || objetivo.length === 0){
                showModal("Campos Vazios", "Alguns dos campos de cadastro estão vazios. Preencha todos os campos para continuar.", "warning");
                return;
            }
            
            createUserWithEmailAndPassword(auth, email, password)
            
            .then(async (userCredential) => {
                console.log("Usuário cadastrado com sucesso!");

                // Salvar dados do usuário no Firebase
                const db = getDatabase(app);
                const userRef = ref(db, `users/${userCredential.user.uid}`);

                const userData = {
                    nome,
                    email,
                    idade,
                    sexo,
                    altura,
                    peso,
                    objetivo,
                    createdAt: new Date().toISOString(),
                    emailVerified: false
                }

                try {
                    await set(userRef, userData);
                    console.log("Dados do usuário salvos com sucesso!");
                    
                    // Enviar email de verificação
                    await sendEmailVerification(auth.currentUser);
                    
                    // Mostrar modal de sucesso com informações sobre verificação
                    showModal(
                        "Cadastro Realizado com Sucesso! 🎉", 
                        `Parabéns, ${nome}! Sua conta foi criada com sucesso.\n\n📧 Um email de verificação foi enviado para:\n${email}\n\n⚠️ IMPORTANTE: Verifique sua caixa de entrada (e spam) e clique no link de confirmação para ativar sua conta antes de fazer login.\n\nApós verificar o email, você poderá fazer login normalmente.`, 
                        "success"
                    );
                    
                    // Fazer logout após 5 segundos - o App.js navegará automaticamente para AuthTabs
                    setTimeout(() => {
                        signOut(auth);
                        // Não é necessário navegar manualmente - o App.js detecta o logout e navega automaticamente
                    }, 5000);
                    
                } catch (error) {
                    console.log("Erro ao salvar dados do usuário:", error);
                    showModal(
                        "Conta Criada, Mas...", 
                        "Sua conta foi criada, mas houve um problema ao salvar seus dados. Entre em contato com o suporte.", 
                        "warning"
                    );
                }

            })
            .catch((error)=>{
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
            console.log("Erro inesperado:", error);
            showModal(
                "Erro Inesperado", 
                "Ocorreu um erro inesperado. Tente novamente ou entre em contato com o suporte.", 
                "error"
            );
        }
    }

    function handleAltura(input) {
        let alturaFormatada = input.replace(/[^0-9]/g, '').slice(0, 3);
        let alturaFormatada2 = alturaFormatada;
        if (alturaFormatada.length > 1) {
            alturaFormatada2 = `${alturaFormatada.slice(0, 1)}.${alturaFormatada.slice(1, 3)}`;
        }
        setAltura(alturaFormatada2);
    }

    function handlePeso(input) {
        let pesoFormatado = input.replace(/[^0-9]/g, '').slice(0, 3);
        let pesoFormatado2 = pesoFormatado;
        if (pesoFormatado.length > 1) {
            pesoFormatado2 = `${pesoFormatado.slice(0, 2)},${pesoFormatado.slice(2, 3) || '0'}`;
        }
        setPeso(pesoFormatado2);
    }

    return (
        <SafeAreaView style={[styles.hrContainer,{backgroundColor: background}]}>

            <ImageBackground
                source={require('../../../../assets/Frutas_home.png')} 
                style={styles.hrBackgroundImage}
            >

            <View style={styles.hrForm}>
                <CustomField title="Altura" placeholder="Insira sua altura" value={altura} setValue={handleAltura} keyboardType='numeric'/>
                <CustomField title="Peso" placeholder="Insira seu peso" value={peso} setValue={handlePeso} keyboardType='numeric'/>

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
                
                <TouchableOpacity onPress={() => navigation.navigate("Restricoes")} style={styles.hrLink}>
                    <Text style={styles.hrLinkText}>Restrições Alimentares</Text>
                </TouchableOpacity>

                
                <View style={styles.hrBottom}>
                <CustomButton title="Cadastrar" modeButton={true} onPress={cadastro}/>
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

