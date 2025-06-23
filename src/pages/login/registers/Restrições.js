import { SafeAreaView, View, useColorScheme, Text, ImageBackground, ScrollView } from "react-native";
import CustomField from "../../../components/CustomField";
import React, { useState } from "react";
import CustomButton from "../../../components/CustomButton.js";
import { useNavigation } from "@react-navigation/native";
import CustomMultiPicker from "../../../components/CustomMultiPicker";
import styles from "../../../theme/styles";

export default function Restricoes() {
    const colorScheme = useColorScheme();
    const background = colorScheme === 'dark'? "#1C1C1E" : "#F2F2F2";
    const navigate = useNavigation();
    const [Alergias, setAlergias] = useState('');
    const [intolerancias, setIntolerancias] = useState([]);
    const [Condicoes, setCondicoes] = useState([]);

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

    return(
        <SafeAreaView style={{flex: 1, backgroundColor: background}}>
            <ImageBackground
                source={require('../../../../assets/Frutas_home.png')}
                style={{flex: 1, resizeMode: 'cover'}}
            >
                <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20}} keyboardShouldPersistTaps="handled">
                    <View style={{width: '100%', maxWidth: 420, backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 18, padding: 24, shadowColor: '#000', shadowOpacity: 0.08, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 3}}>
                        <Text style={{fontSize: 28, fontWeight: 'bold', color: '#2E8331', textAlign: 'center', marginBottom: 8}}>Restrições Alimentares</Text>
                        <Text style={{fontSize: 15, color: '#555', textAlign: 'center', marginBottom: 18}}>
                            Informe alergias, intolerâncias e condições médicas para personalizar sua experiência.
                        </Text>
                        <CustomField title="Alergias" placeholder="Insira suas alergias" value={Alergias} setValue={setAlergias}/>
                        <View style={{marginVertical: 10}}>
                            <CustomMultiPicker
                                label="Intolerâncias"
                                options={intoleranciasOptions}
                                selectedItems={intolerancias}
                                onSelectedItemsChange={setIntolerancias}
                            />
                        </View>
                        <View style={{marginVertical: 10}}>
                            <CustomMultiPicker
                                label="Condições Médicas"
                                options={condicoesOptions}
                                selectedItems={Condicoes}
                                onSelectedItemsChange={setCondicoes}
                            />
                        </View>
                        <CustomButton title="Salvar" modeButton={true} size="large" style={{width: '100%', marginTop: 24}} onPress={()=>navigate.goBack()}/>
                    </View>
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    );
}

