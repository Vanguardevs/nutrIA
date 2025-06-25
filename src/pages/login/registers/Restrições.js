import { SafeAreaView, View, useColorScheme, Text, ImageBackground, ScrollView, Alert, KeyboardAvoidingView, Platform } from "react-native";
import CustomField from "../../../components/CustomField";
import React, { useState } from "react";
import CustomButton from "../../../components/CustomButton.js";
import { useNavigation } from "@react-navigation/native";
import CustomMultiPicker from "../../../components/CustomMultiPicker";
import styles from "../../../theme/styles";
import { getDatabase, ref, update } from 'firebase/database';
import { auth } from '../../../database/firebase';
import CustomModal from '../../../components/CustomModal';

export default function Restricoes() {
    const colorScheme = useColorScheme();
    const background = colorScheme === 'dark'? "#1C1C1E" : "#F2F2F2";
    const navigate = useNavigation();
    const [Alergias, setAlergias] = useState('');
    const [intolerancias, setIntolerancias] = useState([]);
    const [Condicoes, setCondicoes] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);

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

    async function handleSalvar() {
        setShowConfirm(true);
    }

    async function confirmarSalvar() {
        const userId = auth.currentUser?.uid;
        if (!userId) {
            Alert.alert('Erro', 'Usuário não autenticado. Faça login novamente.');
            return;
        }
        const db = getDatabase();
        const restricoesRef = ref(db, `users/${userId}/restricoes`);
        try {
            await update(restricoesRef, {
                alergias: Alergias,
                intolerancias: intolerancias,
                condicoes: Condicoes
            });
            Alert.alert('Restrições salvas!', 'Suas restrições alimentares foram salvas com sucesso.');
            navigate.goBack();
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível salvar as restrições. Tente novamente.');
        }
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
                        <CustomField title="Alergias" placeholder="Ex: Amendoim, frutos do mar..." value={Alergias} setValue={setAlergias}/>
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
                            shadowColor: '#2E8331',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            elevation: 6,
                            borderRadius: 12
                        }}>
                            <CustomButton 
                                title="Salvar" 
                                modeButton={true} 
                                size="large" 
                                style={{width: '100%'}} 
                                onPress={handleSalvar}
                            />
                        </View>
                    </View>
                </ScrollView>
                </KeyboardAvoidingView>
            </ImageBackground>
            <CustomModal
                visible={showConfirm}
                onClose={() => setShowConfirm(false)}
                title="Confirmar alterações"
                message="Tem certeza que deseja salvar as restrições alimentares?"
                type="warning"
                buttons={[
                    {
                        text: 'Cancelar',
                        onPress: () => setShowConfirm(false),
                        style: 'secondary'
                    },
                    {
                        text: 'Confirmar',
                        onPress: () => {
                            setShowConfirm(false);
                            confirmarSalvar();
                        },
                        style: 'primary'
                    }
                ]}
            />
        </SafeAreaView>
    );
}