import { SafeAreaView, View, useColorScheme, Text, ImageBackground, ScrollView, Alert, KeyboardAvoidingView, Platform } from "react-native";
import CustomField from "../../../components/CustomField";
import React, { useState, useEffect } from "react";
import CustomButton from "../../../components/CustomButton.js";
import { useNavigation, useRoute } from "@react-navigation/native";
import CustomMultiPicker from "../../../components/CustomMultiPicker";
import styles from "../../../theme/styles";
import { getDatabase, ref, set, onValue, push } from 'firebase/database';
import { auth } from '../../../database/firebase';
import CustomModal from '../../../components/CustomModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Restricoes() {
    const colorScheme = useColorScheme();
    const background = colorScheme === 'dark'? "#1C1C1E" : "#F2F2F2";
    const navigate = useNavigation();
    const route = useRoute();
    const [Alergias, setAlergias] = useState('');
    const [intolerancias, setIntolerancias] = useState([]);
    const [Condicoes, setCondicoes] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showEmailConfirm, setShowEmailConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const intoleranciasOptions = [
        { id: 'Açucar', name: 'Açucar' },
        { id: 'Lactose', name: 'Lactose' },
        { id: 'Gluten', name: 'Gluten' },
        { id: 'Sacarose', name: 'Sacarose' },
        { id: 'Frutose', name: 'Frutose' },
        { id: 'Histamina', name: 'Histamina' },
        { id: 'Sulfito', name: 'Sulfito' },
        { id: 'Sorbitol', name: 'Sorbitol' },
        { id: 'Aditivos', name: 'Aditivos' },
        { id: 'Corantes', name: 'Corantes' },
        { id: 'Conservantes', name: 'Conservantes' },
        { id: 'Origem Animal', name: 'Origem Animal' },
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

    // Carregar dados existentes ao inicializar o componente
    useEffect(() => {
        carregarDadosExistentes();
    }, []);

    const carregarDadosExistentes = () => {
        const userId = route?.params?.uid || auth.currentUser?.uid;
        if (!userId) {
            console.log('[Restricoes] Usuário não identificado');
            return;
        }
        const db = getDatabase();
        // Se for cadastro, buscar em pendingUsers; se for edição, buscar em users
        const userHealthRef = ref(db, `users/${userId}/`);
        const unsubscribe = onValue(userHealthRef, (snapshot) => {
            const data = snapshot.val();
            console.log('[Restricoes] Dados carregados:', data);
            if (data) {
                const alergiasValue = data.alergias;
                setAlergias(alergiasValue === 'Nenhuma' || !alergiasValue ? '' : alergiasValue);
                setIntolerancias(data.intolerancias || []);
                setCondicoes(data.condicoes || []);
            }
        }, (error) => {
            console.error('[Restricoes] Erro ao carregar dados:', error);
        });
        return unsubscribe;
    };

    async function handleSalvar() {
        // Permitir salvar mesmo se apenas alergias estiver vazio (será salvo como "Nenhuma")
        // Só validar se TODOS os campos estiverem vazios
        if (!Alergias.trim() && intolerancias.length === 0 && Condicoes.length === 0) {
            // Ainda assim permitir salvar para cadastrar "Nenhuma" nas alergias
            // Alert.alert('Atenção', 'Preencha pelo menos um campo antes de salvar.');
            // return;
        }
        setShowConfirm(true);
    }

    async function confirmarSalvar() {
        setLoading(true);
        try {
            const userId = route?.params?.uid || auth.currentUser?.uid;
            if (!userId) {
                Alert.alert('Erro', 'Usuário não identificado. Faça o cadastro novamente.');
                setLoading(false);
                return;
            }
            const db = getDatabase();
            const healthData = {
                alergias: Alergias.trim() || 'Nenhuma',
                intolerancias: Array.isArray(intolerancias) ? intolerancias : [],
                condicoes: Array.isArray(Condicoes) ? Condicoes : [],
                updatedAt: Date.now(),
                createdAt: Date.now()
            };
            // Se for cadastro, salvar em pendingUsers; se for edição, salvar em users
            const healthRef = ref(db, `users/${userId}/health`);
            await set(healthRef, healthData);
            setShowSuccess(true);
        } catch (error) {
            setLoading(false);
            setShowConfirm(false);
            console.log('[Restricoes] Erro ao salvar restrições:', error);
            Alert.alert('Erro', 'Não foi possível salvar as restrições. Tente novamente.');
        }
        setLoading(false);
    }

    return(
        <SafeAreaView style={{flex: 1, backgroundColor: background}}>
            <ImageBackground
                source={require('../../../../assets/Frutas_home.png')}
                style={{flex: 1, resizeMode: 'cover'}}>
                <KeyboardAvoidingView
                    style={{flex: 1}}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20}} keyboardShouldPersistTaps="handled">
                    <View style={{width: '100%', maxWidth: 420, backgroundColor: 'rgba(255,255,255,0.97)', borderRadius: 18, padding: 28, shadowColor: '#000', shadowOpacity: 0.10, shadowOffset: { width: 0, height: 2 }, shadowRadius: 12, elevation: 4, alignItems: 'center'}}>
                        <Text style={{fontSize: 28, fontWeight: 'bold', color: '#2E8331', textAlign: 'center', marginBottom: 8, letterSpacing: 0.5}}>Restrições Alimentares</Text>
                        <Text style={{fontSize: 16, color: '#555', textAlign: 'center', marginBottom: 22, lineHeight: 22}}>
                            Informe alergias, intolerâncias e condições médicas para personalizar sua experiência.
                        </Text>
                        
                        <CustomField 
                            title="Alergias" 
                            placeholder="Ex: Amendoim, frutos do mar..." 
                            value={Alergias} 
                            setValue={setAlergias}
                        />
                        
                        <View style={{marginVertical: 14, width: '100%', alignItems: 'center'}}>
                            <CustomMultiPicker
                                label="Intolerâncias"
                                options={intoleranciasOptions}
                                selectedItems={intolerancias}
                                onSelectedItemsChange={setIntolerancias}
                            />
                        </View>
                        
                        <View style={{marginVertical: 14, width: '100%', alignItems: 'center'}}>
                            <CustomMultiPicker
                                label="Condições Médicas"
                                options={condicoesOptions}
                                selectedItems={Condicoes}
                                onSelectedItemsChange={setCondicoes}
                            />
                        </View>
                        
                        <View style={{
                            width: '100%',
                            marginTop: 28,
                            borderRadius: 12
                        }}>
                            <CustomButton 
                                title={loading ? "Salvando..." : "Salvar"} 
                                modeButton={true} 
                                size="large" 
                                style={{
                                    width: '100%', 
                                    elevation: 0, 
                                    shadowColor: 'transparent', 
                                    shadowOpacity: 0, 
                                    shadowOffset: { width: 0, height: 0 }, 
                                    shadowRadius: 0,
                                    opacity: loading ? 0.6 : 1,
                                }} 
                                onPress={confirmarSalvar}
                                disabled={loading}
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
                    navigate.replace('Login');
                }}
                title="Confirme seu e-mail"
                message="Um e-mail de confirmação foi enviado. Verifique sua caixa de entrada e spam, clique no link de confirmação e só então faça login."
                icon="mail"
                primaryButtonText="OK"
                onPrimaryPress={() => {
                    setShowEmailConfirm(false);
                    navigate.replace('Login');
                }}
                showButtons={true}
            />
        </SafeAreaView>
    );
}