import { SafeAreaView, View, useColorScheme } from "react-native";
import CustomField from "../../../components/CustomField";
import React, { useState } from "react";
import CustomButton from "../../../components/CustomButton";
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
        <SafeAreaView style={[styles.rtContainer,{backgroundColor: background}]}>
            <View style={styles.rtCenter}>
                <View style={styles.rtField}>
                <CustomField title="Alergias" placeholder="Insira suas alergias" value={Alergias} setValue={setAlergias}/>
                </View>

                    <CustomMultiPicker
                    label="Intolerâncias"
                    options={intoleranciasOptions}
                    selectedItems={intolerancias}
                    onSelectedItemsChange={setIntolerancias}
                    />

                    <CustomMultiPicker
                    label="Condições Médicas"
                    options={condicoesOptions}
                    selectedItems={Condicoes}
                    onSelectedItemsChange={setCondicoes}
                    />

                <View style={styles.rtButton}>
                    <CustomButton title="Salvar" modeButton={true} onPress={()=>navigate.goBack()}/>
                </View>
            </View>
        </SafeAreaView>
    );
}

