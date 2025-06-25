import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, Alert, ScrollView, ActivityIndicator } from 'react-native';
import CustomField from '../../../components/CustomField';
import CustomMultiPicker from '../../../components/CustomMultiPicker';
import CustomButton from '../../../components/CustomButton';
import CustomModal from '../../../components/CustomModal';
import { getDatabase, ref, onValue, update } from 'firebase/database';
import { auth } from '../../../database/firebase';

export default function EditHealth() {
    const [Alergias, setAlergias] = useState('');
    const [intolerancias, setIntolerancias] = useState([]);
    const [Condicoes, setCondicoes] = useState([]);
    const [loading, setLoading] = useState(true);
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

    useEffect(() => {
        const db = getDatabase();
        const userId = auth.currentUser?.uid;
        const restricoesRef = ref(db, `users/${userId}/restricoes`);
        const unsubscribe = onValue(restricoesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setAlergias(data.alergias || '');
                setIntolerancias(data.intolerancias || []);
                setCondicoes(data.condicoes || []);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    function handleSalvar() {
        setShowConfirm(true);
    }

    async function confirmarSalvar() {
        const db = getDatabase();
        const userId = auth.currentUser?.uid;
        const restricoesRef = ref(db, `users/${userId}/restricoes`);
        try {
            await update(restricoesRef, {
                alergias: Alergias,
                intolerancias: intolerancias,
                condicoes: Condicoes
            });
            Alert.alert('Sucesso', 'Condições médicas atualizadas com sucesso!');
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível salvar as condições. Tente novamente.');
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
                    <CustomButton
                        title="Salvar"
                        onPress={handleSalvar}
                        modeButton={true}
                        size="large"
                        style={{width: '100%'}}
                    />
                </View>
            </ScrollView>
            <CustomModal
                visible={showConfirm}
                onClose={() => setShowConfirm(false)}
                title="Confirmar alterações"
                message="Tem certeza que deseja salvar as condições médicas?"
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