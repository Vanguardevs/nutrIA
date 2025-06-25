import {View, SafeAreaView, ImageBackground, StyleSheet, Alert, useColorScheme, TouchableOpacity, Text, ScrollView, FlatList} from 'react-native';
import CustomField from '../../../components/CustomField';
import CustomPicker from '../../../components/CustomPicker';
import CustomButton from '../../../components/CustomButton.js';
import CustomModal from '../../../components/CustomModal.tsx';
import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { getDatabase, ref, push } from 'firebase/database';
import { auth } from '../../../database/firebase';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { loadFoodsData } from '../../../utils/foodsLoader';
import { Ionicons } from '@expo/vector-icons';

export default function CreateDiary() {
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
    const [refeicao, setRefeicao] = useState('');
    const [hora, setHora] = useState('');
    const [tipoRefeicao, setTipoRefeicao] = useState('');
    const [loading, setLoading] = useState(false);
    const [sugestoes, setSugestoes] = useState([]);
    const [alimentos, setAlimentos] = useState([]);
    const [isLoadingFoods, setIsLoadingFoods] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [agendaData, setAgendaData] = useState(null);
    const [alimentoInput, setAlimentoInput] = useState('');
    const [alimentosAgenda, setAlimentosAgenda] = useState([]);

    const colorSheme = useColorScheme();
    const backgoundH = colorSheme === 'dark' ? "#1C1C1E" : "#F2F2F2";

    const navigation = useNavigation();

    const ignoreNextInput = useRef(false);
    const isSavingRef = useRef(false);
    const lastSaveTime = useRef(0);
    const saveInProgress = useRef(false);
    const saveCount = useRef(0); // Contador para debug

    useEffect(() => {
        const loadFoods = async () => {
            try {
                setIsLoadingFoods(true);
                
                try {
                    const foodsData = await loadFoodsData();
                    setAlimentos(foodsData);
                } catch (cacheError) {
                    console.warn('Cache de alimentos falhou, usando require como fallback:', cacheError);
                    const foodsData = require('../foods.json');
                    setAlimentos(foodsData);
                }
            } catch(e) {
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
        if (!alimentos || alimentos.length === 0) return [];
        return alimentos;
    }, [alimentos]);

    const showTimePicker = useCallback(() => setTimePickerVisibility(true), []);
    const hideTimePicker = useCallback(() => setTimePickerVisibility(false), []);

    const handleTimeConfirm = useCallback((time) => {
        const hours = time.getHours().toString().padStart(2, '0');
        const minutes = time.getMinutes().toString().padStart(2, '0');
        setHora(`${hours}:${minutes}`);
        hideTimePicker();
    }, [hideTimePicker]);

    const adicionarAlimento = useCallback(() => {
        const valor = alimentoInput.trim();
        if (valor.length > 0 && !alimentosAgenda.includes(valor)) {
            setAlimentosAgenda(prev => [...prev, valor]);
            setAlimentoInput('');
            setSugestoes([]);
        }
    }, [alimentoInput, alimentosAgenda]);

    const removerAlimento = useCallback((alimento) => {
        setAlimentosAgenda(prev => prev.filter(a => a !== alimento));
    }, []);

    const filtrarSugestoes = useCallback((texto) => {
        setAlimentoInput(texto);
        if (texto.length < 2) {
            setSugestoes([]);
            return;
        }
        const textoNormalizado = texto.normalize('NFD').replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase();
        const filtrados = alimentosOtimizados.filter(item =>
            item.descricaoNormalizada && item.descricaoNormalizada.includes(textoNormalizado)
        ).slice(0, 6);
        setSugestoes(filtrados);
    }, [alimentosOtimizados]);

    const handleSugestaoPress = useCallback((item) => {
        setAlimentoInput(item.descricao);
        setSugestoes([]);
    }, []);

    const salvarAgenda = useCallback(async () => {
        const saveId = ++saveCount.current;
        console.log(`[SAVE ${saveId}] Iniciando tentativa de salvamento`);
        
        const now = Date.now();
        
        if (saveInProgress.current) {
            console.log(`[SAVE ${saveId}] Salvamento já em progresso, ignorando...`);
            return;
        }
        
        if (now - lastSaveTime.current < 3000) {
            console.log(`[SAVE ${saveId}] Debounce: clique muito próximo, ignorando...`);
            return;
        }

        if (alimentosAgenda.length === 0 || hora === '' || tipoRefeicao === '') {
            console.log(`[SAVE ${saveId}] Campos vazios, ignorando...`);
            Alert.alert("Tente novamente", "Alguns dos campos de cadastro estão vazios");
            return;
        }

        console.log(`[SAVE ${saveId}] Passou por todas as verificações, iniciando salvamento...`);
        
        lastSaveTime.current = now;
        saveInProgress.current = true;
        isSavingRef.current = true;
        setIsSaving(true);
        setLoading(true);

        try {
            const data = {
                "tipo_refeicao": tipoRefeicao,
                "alimentos": alimentosAgenda,
                "hora": hora,
                "id_user": auth.currentUser.uid,
                "saveId": saveId,
                "timestamp": new Date().toISOString()
            };

            console.log(`[SAVE ${saveId}] Dados para salvar:`, data);

            const db = getDatabase();
            const userId = auth.currentUser.uid;
            const diariesRef = ref(db, `users/${userId}/diaries`);
            
            const pushResult = await push(diariesRef, {
                tipo_refeicao: tipoRefeicao,
                alimentos: alimentosAgenda,
                hora: hora,
                progress: [false, false, false, false, false, false, false],
                createdAt: new Date().toISOString(),
                saveId: saveId,
                debugTimestamp: Date.now()
            });

            console.log(`[SAVE ${saveId}] Firebase salvo com sucesso! Key:`, pushResult.key);

            showSuccessModal({
                tipoRefeicao,
                alimentos: alimentosAgenda,
                horario: hora,
                id: pushResult.key
            });
            
        } catch (error) {
            console.error(`[SAVE ${saveId}] ERRO ao salvar agenda:`, error);
            Alert.alert("Erro", "Erro ao cadastrar a agenda no banco de dados");
        } finally {
            console.log(`[SAVE ${saveId}] Finalizando salvamento, resetando proteções...`);
            setLoading(false);
            setIsSaving(false);
            isSavingRef.current = false;
            saveInProgress.current = false;
        }
    }, [alimentosAgenda, hora, tipoRefeicao, navigation, isSaving, loading]);

    const renderSugestao = useCallback(({ item, index }) => (
        <TouchableOpacity 
            key={index} 
            onPress={() => handleSugestaoPress(item)} 
            style={{ 
                padding: 10, 
                borderBottomWidth: index !== sugestoes.length - 1 ? 1 : 0, 
                borderColor: '#eee' 
            }}
        >
            <Text style={{ color: '#222', fontSize: 15 }}>{item.descricao}</Text>
        </TouchableOpacity>
    ), [sugestoes.length, handleSugestaoPress]);

    const showSuccessModal = useCallback((data) => {
        setAgendaData(data);
        setShowModal(true);
    }, []);

    const hideSuccessModal = useCallback(() => {
        console.log('[MODAL] Botão pressionado - hideSuccessModal chamado!');
        console.log('[MODAL] Fechando modal de sucesso...');
        setShowModal(false);
        setAgendaData(null);
        
        setRefeicao('');
        setHora('');
        setTipoRefeicao('');
        setSugestoes([]);
        setAlimentosAgenda([]);
        setAlimentoInput('');
        
        console.log('[MODAL] Navegando para tab Diary...');
        navigation.navigate('MainTabs', { screen: 'Diary' });
    }, [navigation]);

    const cancelModal = useCallback(() => {
        console.log('[MODAL] Botão cancelar pressionado!');
        console.log('[MODAL] Fechando modal sem navegar...');
        setShowModal(false);
        setAgendaData(null);
    }, []);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: backgoundH }]}>
            <ImageBackground source={require('../../../../assets/Frutas_home.png')} style={styles.imgBackgound}>
                <View style={styles.container_items}>
                    <CustomPicker
                        label="Tipo de Refeição"
                        selectedValue={tipoRefeicao}
                        onValueChange={setTipoRefeicao}
                        options={[
                            { label: 'Café da Manhã', value: 'Café da Manhã' },
                            { label: 'Almoço', value: 'Almoço' },
                            { label: 'Jantar', value: 'Jantar' },
                            { label: 'Lanche da Tarde', value: 'Lanche da Tarde' }
                        ]}
                    />
                    <CustomField
                        title="Alimento"
                        placeholder='Ex: Omelete, Salada...'
                        value={alimentoInput}
                        setValue={filtrarSugestoes}
                        onSubmitEditing={adicionarAlimento}
                    />
                    <TouchableOpacity onPress={adicionarAlimento} style={{ backgroundColor: '#2E8331', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginTop: 6, marginBottom: 8, width: '100%' }}>
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Adicionar</Text>
                    </TouchableOpacity>
                    {alimentosAgenda.length > 0 && (
                        <View style={{ width: '100%', marginVertical: 8 }}>
                            {alimentosAgenda.map((alimento, idx) => (
                                <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#E5E5EA', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 8 }}>
                                    <Text style={{ color: '#222', fontSize: 16, fontWeight: 'bold', marginRight: 8 }}>{idx + 1}.</Text>
                                    <Text style={{ color: '#222', fontSize: 16, flex: 1 }}>{alimento}</Text>
                                    <TouchableOpacity onPress={() => removerAlimento(alimento)} style={{ marginLeft: 6 }}>
                                        <Ionicons name="close-circle" size={20} color="#FF3B30" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    )}
                    {sugestoes.length > 0 && (
                        <View style={{ 
                            width: '100%', 
                            backgroundColor: '#fff', 
                            borderRadius: 8, 
                            marginBottom: 12, 
                            marginTop: 2, 
                            maxHeight: 160, 
                            elevation: 2, 
                            alignSelf: 'center', 
                            shadowColor: '#000', 
                            shadowOpacity: 0.06, 
                            shadowOffset: { width: 0, height: 2 }, 
                            shadowRadius: 4 
                        }}>
                            <ScrollView 
                                style={{ maxHeight: 160 }} 
                                nestedScrollEnabled={true} 
                                showsVerticalScrollIndicator={false}
                                removeClippedSubviews={false}
                                maxToRenderPerBatch={10}
                                windowSize={10}
                            >
                                {sugestoes.map((item, idx) => renderSugestao({ item, index: idx }))}
                            </ScrollView>
                        </View>
                    )}
                    <View style={{ width: '100%', marginBottom: 8 }}>
                        <Text style={{
                            color: '#222',
                            fontSize: 16,
                            fontWeight: 'bold',
                            marginBottom: 4,
                            marginLeft: 2,
                            textAlign: 'center',
                            width: '100%',
                        }}>
                            Horário
                        </Text>
                        <TouchableOpacity
                            onPress={showTimePicker}
                            activeOpacity={0.8}
                            style={{
                                width: '100%',
                                backgroundColor: '#fff',
                                borderColor: '#2E8331',
                                borderWidth: 2,
                                borderRadius: 8,
                                height: 48,
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingLeft: 40,
                                marginBottom: 0,
                            }}
                        >
                            <Ionicons
                                name="time-outline"
                                size={30}
                                color="#2E8331"
                                style={{
                                    position: 'absolute',
                                    left: 14,
                                    top: '50%',
                                    marginTop: -15,
                                    zIndex: 2
                                }}
                            />
                            <View style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: 48
                            }}>
                                <Text
                                    style={{
                                        color: '#222',
                                        fontSize: 18,
                                        height: 48,
                                        lineHeight: 48,
                                        textAlign: 'center',
                                        textAlignVertical: 'center',
                                    }}
                                >
                                    {hora || '00:00'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <DateTimePickerModal
                        isVisible={isTimePickerVisible}
                        mode="time"
                        onConfirm={handleTimeConfirm}
                        onCancel={hideTimePicker}
                    />

                    <CustomButton
                        title={loading ? "Salvando..." : "Salvar"}
                        onPress={salvarAgenda}
                        modeButton={true}
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
                    agendaData ? 
                    `Sua agenda de ${agendaData.tipoRefeicao} foi criada com sucesso!\n\n` +
                    `📝 Refeição: ${agendaData.alimentos.join(', ')}\n` +
                    `⏰ Horário: ${agendaData.horario}\n\n` +
                    `Você receberá notificações diárias neste horário para lembrar de se alimentar.` :
                    "Agenda criada com sucesso!"
                }
                onClose={hideSuccessModal}
                icon="checkmark-circle"
                iconColor="#28A745"
                iconBgColor="#D4EDDA"
                primaryButtonText="Entendi"
                secondaryButtonText="Cancelar"
                onPrimaryPress={hideSuccessModal}
                onSecondaryPress={cancelModal}
                showButtons={true}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    container_items: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        marginTop: '10%',
        marginBottom: '10%',
        padding: 20,
        width: '100%',
    },
    imgBackgound: {
        height: '100%',
        width: '100%',
    },
    saveButton: {
        width: '100%',
        marginTop: 20,
    },
});
