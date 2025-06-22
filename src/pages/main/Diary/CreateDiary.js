import {View, SafeAreaView, ImageBackground, StyleSheet, Alert, useColorScheme, TouchableOpacity, Text, ScrollView} from 'react-native';
import CustomField from '../../../components/CustomField';
import CustomPicker from '../../../components/CustomPicker';
import CustomButton from '../../../components/CustomButton';
import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { getDatabase, ref, push } from 'firebase/database';
import { auth } from '../../../database/firebase';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { loadFoodsData } from '../../../utils/foodsLoader';

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

    const filtrarSugestoes = useCallback((texto) => {
        if (ignoreNextInput.current) {
            ignoreNextInput.current = false;
            setRefeicao(texto);
            setSugestoes([]);
            return;
        }
        setRefeicao(texto);
        if (texto.length < 2) {
            setSugestoes([]);
            return;
        }
        const textoNormalizado = texto.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
        const filtrados = alimentosOtimizados.filter(item =>
            item.descricaoNormalizada.includes(textoNormalizado)
        ).slice(0, 6);
        setSugestoes(filtrados);
    }, [alimentosOtimizados]);

    const handleSugestaoPress = useCallback((item) => {
        ignoreNextInput.current = true;
        setRefeicao(item.descricao);
        setSugestoes([]);
    }, []);

    // Função simplificada de salvamento para debug
    const salvarAgenda = useCallback(async () => {
        const saveId = ++saveCount.current;
        console.log(`[SAVE ${saveId}] Iniciando tentativa de salvamento`);
        
        const now = Date.now();
        
        // Verificações de proteção
        if (saveInProgress.current) {
            console.log(`[SAVE ${saveId}] Salvamento já em progresso, ignorando...`);
            return;
        }
        
        if (now - lastSaveTime.current < 3000) {
            console.log(`[SAVE ${saveId}] Debounce: clique muito próximo, ignorando...`);
            return;
        }

        if (refeicao === '' || hora === '' || tipoRefeicao === '') {
            console.log(`[SAVE ${saveId}] Campos vazios, ignorando...`);
            Alert.alert("Tente novamente", "Alguns dos campos de cadastro estão vazios");
            return;
        }

        console.log(`[SAVE ${saveId}] Passou por todas as verificações, iniciando salvamento...`);
        
        // Marca como salvando
        lastSaveTime.current = now;
        saveInProgress.current = true;
        isSavingRef.current = true;
        setIsSaving(true);
        setLoading(true);

        try {
            const data = {
                "tipo_refeicao": tipoRefeicao,
                "refeicao": refeicao,
                "horario": hora,
                "id_user": auth.currentUser.uid,
                "saveId": saveId, // Para debug
                "timestamp": new Date().toISOString()
            };

            console.log(`[SAVE ${saveId}] Dados para salvar:`, data);

            // SALVAMENTO APENAS NO FIREBASE (removendo API externa temporariamente)
            console.log(`[SAVE ${saveId}] Salvando apenas no Firebase...`);
            
            const db = getDatabase();
            const userId = auth.currentUser.uid;
            const diariesRef = ref(db, `users/${userId}/diaries`);
            
            const pushResult = await push(diariesRef, {
                tipo_refeicao: tipoRefeicao,
                refeicao: refeicao,
                horario: hora,
                progress: [false, false, false, false, false, false, false],
                createdAt: new Date().toISOString(),
                saveId: saveId, // Para debug
                debugTimestamp: Date.now()
            });

            console.log(`[SAVE ${saveId}] Firebase salvo com sucesso! Key:`, pushResult.key);

            Alert.alert("Sucesso", "Agenda cadastrada com sucesso!");
            
            // Limpa os campos
            setRefeicao('');
            setHora('');
            setTipoRefeicao('');
            setSugestoes([]);
            
            // Navega após um delay
            setTimeout(() => {
                console.log(`[SAVE ${saveId}] Navegando de volta...`);
                if (navigation.canGoBack()) {
                    navigation.goBack();
                } else {
                    navigation.navigate('Nutria');
                }
            }, 1000); // Aumentei o delay para debug
            
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
    }, [refeicao, hora, tipoRefeicao, navigation, isSaving, loading]);

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
                        title="Refeição"
                        placeholder='Ex: Omelete, Salada...'
                        value={refeicao}
                        setValue={filtrarSugestoes}
                    />
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
                    <TouchableOpacity onPress={showTimePicker} style={{ width: '100%' }}>
                        <CustomField
                            title="Horário"
                            placeholder='00:00'
                            value={hora}
                            setValue={() => {}}
                            editable={false}
                        />
                    </TouchableOpacity>

                    <DateTimePickerModal
                        isVisible={isTimePickerVisible}
                        mode="time"
                        onConfirm={handleTimeConfirm}
                        onCancel={hideTimePicker}
                        locale="pt-BR"
                        headerTextIOS="Escolha o horário"
                    />
                    <CustomButton
                        title={loading ? "Salvando..." : "Salvar"}
                        onPress={salvarAgenda}
                        modeButton={true}
                        isLoading={loading || isLoadingFoods || isSaving}
                    />
                </View>
            </ImageBackground>
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
});
