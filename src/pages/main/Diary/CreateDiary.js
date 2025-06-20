import {View, SafeAreaView, ImageBackground, StyleSheet, Alert, useColorScheme, TouchableOpacity, Text} from 'react-native';
import CustomField from '../../../components/CustomField';
import CustomPicker from '../../../components/CustomPicker';
import CustomButton from '../../../components/CustomButton';
import React, { useState } from 'react';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { getDatabase, ref, push } from 'firebase/database';
import { auth } from '../../../database/firebase';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default function CreateDiary() {
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
    const [refeicao, setRefeicao] = useState('');
    const [hora, setHora] = useState('');
    const [tipoRefeicao, setTipoRefeicao] = useState('');
    const [loading, setLoading] = useState(false);

    const colorSheme = useColorScheme();
    const backgoundH = colorSheme === 'dark' ? "#1C1C1E" : "#F2F2F2";

    const navigation = useNavigation();

    const showTimePicker = () => setTimePickerVisibility(true);
    const hideTimePicker = () => setTimePickerVisibility(false);

    const handleTimeConfirm = (time) => {
        const hours = time.getHours().toString().padStart(2, '0');
        const minutes = time.getMinutes().toString().padStart(2, '0');
        setHora(`${hours}:${minutes}`);
        hideTimePicker();
    };

    async function salvarAgenda() {
        if (refeicao === '' || hora === '' || tipoRefeicao === '') {
            Alert.alert("Tente novamente", "Alguns dos campos de cadastro estão vazios");
            return;
        }

        setLoading(true);

        try {
            const data = {
                "tipo_refeicao": tipoRefeicao,
                "refeicao": refeicao,
                "horario": hora,
                "id_user": auth.currentUser.uid
            };

            // 1. Envia para a API externa
            await axios.post("https://nutria-6uny.onrender.com/calories", data);

            // 2. Salva no Firebase
            const db = getDatabase();
            const userId = auth.currentUser.uid;
            const diariesRef = ref(db, `users/${userId}/diaries`);
            await push(diariesRef, {
                tipo_refeicao: tipoRefeicao,
                refeicao: refeicao,
                horario: hora,
                progress: [false, false, false, false, false, false, false], // ou conforme sua lógica
                createdAt: new Date().toISOString()
            });

            Alert.alert("Sucesso", "Agenda cadastrada com sucesso!");
            if (navigation.canGoBack()) {
                navigation.goBack();
            } else {
                navigation.navigate('Nutria');
            }
        } catch (error) {
            console.log("ERROR", error);
            Alert.alert("Erro", "Erro ao cadastrar a agenda no banco de dados");
        } finally {
            setLoading(false);
        }
    }

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
                        setValue={setRefeicao}
                    />

                    <TouchableOpacity onPress={showTimePicker} style={{ width: '100%' }}>
                        <CustomField
                            title="Horário"
                            placeholder='00:00'
                            value={hora}
                            setValue={() => {}} // Não permite digitação manual
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
                        disabled={loading}
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
