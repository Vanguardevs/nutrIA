import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, Alert, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import CustomField from '../../../components/CustomField';
import CustomMultiPicker from '../../../components/CustomMultiPicker';
import CustomButton from '../../../components/CustomButton';
import CustomModal from '../../../components/CustomModal';
import { getDatabase, ref, onValue, set, update } from 'firebase/database';
import { auth } from '../../../database/firebase';
import { useNavigation } from '@react-navigation/native';

export default function EditHealth() {
    const [alergias, setAlergias] = useState('');
    const [intolerancias, setIntolerancias] = useState([]);
    const [condicoes, setCondicoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [saving, setSaving] = useState(false);
    const navigation = useNavigation();

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

    useEffect(() => {
        console.log('[EditHealth] Iniciando carregamento dos dados...');
        
        // Verificar se há usuário autenticado
        const currentUser = auth.currentUser;
        console.log('[EditHealth] Usuário atual:', currentUser?.uid);
        
        if (!currentUser) {
            console.log('[EditHealth] Nenhum usuário autenticado');
            Alert.alert('Erro', 'Usuário não autenticado. Faça login novamente.');
            setLoading(false);
            return;
        }

        const db = getDatabase();
        const userId = currentUser.uid;
        const healthRef = ref(db, `users/${userId}/health`);
        
        console.log('[EditHealth] Caminho do Firebase:', `users/${userId}/health`);

        const unsubscribe = onValue(healthRef, (snapshot) => {
            console.log('[EditHealth] Snapshot recebido:', snapshot.exists());
            const data = snapshot.val();
            console.log('[EditHealth] Dados do Firebase:', JSON.stringify(data, null, 2));
            
            if (data) {
                const alergiaValue = data.alergias === 'Nenhuma' || !data.alergias ? '' : data.alergias;
                const intoleranciasValue = Array.isArray(data.intolerancias) ? data.intolerancias : [];
                const condicoesValue = Array.isArray(data.condicoes) ? data.condicoes : [];
                
                console.log('[EditHealth] Definindo estados:');
                console.log('- Alergias:', alergiaValue);
                console.log('- Intolerâncias:', intoleranciasValue);
                console.log('- Condições:', condicoesValue);
                
                setAlergias(alergiaValue);
                setIntolerancias(intoleranciasValue);
                setCondicoes(condicoesValue);
            } else {
                console.log('[EditHealth] Nenhum dado encontrado, inicializando com valores vazios');
                setAlergias('');
                setIntolerancias([]);
                setCondicoes([]);
            }
            setLoading(false);
        }, (error) => {
            console.error('[EditHealth] Erro ao carregar dados:', error);
            Alert.alert('Erro', `Não foi possível carregar os dados: ${error.message}`);
            setLoading(false);
        });

        return () => {
            console.log('[EditHealth] Limpando listener');
            unsubscribe();
        };
    }, []);

    function handleSalvar() {
        console.log('[EditHealth] Botão salvar pressionado');
        console.log('Estados atuais:');
        console.log('- Alergias:', alergias);
        console.log('- Intolerâncias:', intolerancias);
        console.log('- Condições:', condicoes);
        setShowConfirm(true);
    }

    async function confirmarSalvar() {
        console.log('[EditHealth] ===== INICIANDO PROCESSO DE SALVAMENTO =====');
        console.log('[EditHealth] confirmarSalvar() foi chamada!');
        
        setSaving(true);
        
        try {
            // Verificar usuário novamente
            const currentUser = auth.currentUser;
            if (!currentUser) {
                console.log('[EditHealth] Usuário não autenticado no momento do salvamento');
                Alert.alert('Erro', 'Usuário não autenticado. Faça login novamente.');
                setSaving(false);
                return;
            }

            const db = getDatabase();
            const userId = currentUser.uid;
            console.log('[EditHealth] ID do usuário:', userId);
            
            // Processar dados para salvamento
            const alergiasTratadas = alergias.trim() === '' ? 'Nenhuma' : alergias.trim();
            const intoleranciasArray = Array.isArray(intolerancias) ? intolerancias : [];
            const condicoesArray = Array.isArray(condicoes) ? condicoes : [];
            
            const dadosParaSalvar = {
                alergias: alergiasTratadas,
                intolerancias: intoleranciasArray,
                condicoes: condicoesArray,
                updatedAt: new Date().toISOString()
            };

            console.log('[EditHealth] Dados preparados para salvamento:', JSON.stringify(dadosParaSalvar, null, 2));
            
            const healthRef = ref(db, `users/${userId}/health`);
            console.log('[EditHealth] Referência do Firebase:', `users/${userId}/health`);

            // Tentar primeiro com set (sobrescrever completamente)
            await set(healthRef, dadosParaSalvar);
            
            console.log('[EditHealth] Dados salvos com sucesso no Firebase!');
            
            setSaving(false);
            setShowSuccess(true);
            
        } catch (error) {
            console.error('[EditHealth] Erro detalhado ao salvar:', error);
            console.error('[EditHealth] Tipo do erro:', typeof error);
            console.error('[EditHealth] Stack trace:', error.stack);
            
            setSaving(false);
            Alert.alert(
                'Erro ao Salvar',
                `Não foi possível salvar as informações.\n\nDetalhes: ${error.message || error.toString()}\n\nTente novamente ou contate o suporte.`
            );
        }
    }

    if (loading) {
        return (
            <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size="large" color="#2E8331" />
                <Text style={{marginTop: 16}}>Carregando restrições...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#F2F2F2'}}>
            <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20}}>
                <View style={{width: '100%', maxWidth: 420, backgroundColor: 'rgba(255,255,255,0.97)', borderRadius: 18, padding: 28, shadowColor: '#000', shadowOpacity: 0.10, shadowOffset: { width: 0, height: 2 }, shadowRadius: 12, elevation: 4, alignItems: 'center'}}>
                    <Text style={{fontSize: 28, fontWeight: 'bold', color: '#2E8331', textAlign: 'center', marginBottom: 8, letterSpacing: 0.5}}>Condições Médicas</Text>
                    <Text style={{fontSize: 16, color: '#555', textAlign: 'center', marginBottom: 22, lineHeight: 22}}>
                        Edite suas alergias, intolerâncias e condições médicas.
                    </Text>
                    <View style={{width: '100%', position: 'relative'}}>
                        <CustomField 
                            title="Alergias" 
                            placeholder="Ex: Amendoim, frutos do mar..." 
                            value={alergias} 
                            setValue={setAlergias}
                        />
                    </View>
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
                            selectedItems={condicoes}
                            onSelectedItemsChange={setCondicoes}
                        />
                    </View>
                    <CustomButton
                        title={saving ? "Salvando..." : "Salvar"}
                        onPress={confirmarSalvar}
                        modeButton={true}
                        size="large"
                        style={{width: '100%', opacity: saving ? 0.7 : 1}}
                        disabled={saving}
                    />
                </View>
            </ScrollView>
            
            <CustomModal
                visible={showSuccess}
                onClose={() => {
                    setShowSuccess(false);
                    navigation.goBack();
                }}
                title="Sucesso"
                message="Condições médicas atualizadas com sucesso!"
                type="success"
                buttons={[
                    {
                        text: 'OK',
                        onPress: () => {
                            setShowSuccess(false);
                            navigation.goBack();
                        },
                        style: 'primary'
                    }
                ]}
            />
        </SafeAreaView>
    );
}