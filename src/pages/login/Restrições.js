import { SafeAreaView, StyleSheet, TouchableOpacity, View, Text, useColorScheme } from "react-native";
import CustomField from "../../components/shared/CustomField";
import React, {useEffect, useState} from "react";
import CustomPicker from "../../components/shared/CustomPicker";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import styles from "../../theme/styles";

export default function Restricoes() {

    const colorScheme = useColorScheme();

    const background = colorScheme === 'dark'? "#1C1C1E" : "#F2F2F2";
    const texts = colorScheme === 'dark'? "#F2F2F2" : "#1C1C1E";

    const navigate = useNavigation();
    const [Alergias, setAlergias] = useState();
    const [intolerâncias, setIntolerâncias] = useState();
    const [Condicoes, setCondicoes] = useState();

    return(
        <SafeAreaView style={[styles.rtContainer,{backgroundColor: background}]}>
            
            <View style={styles.rtCenter}>

                <CustomField title="Alergias" placeholder="Insira sua Alergias" value={Alergias} setValue={setAlergias}/>
                <CustomPicker label="Intolerâncias" setValue={intolerâncias} onValueChange={setIntolerâncias} options={[
                    {label:"Açucar"},
                    {label: "Lactose"},
                    {label: "Gluten"},
                    {label: 'Sacarose'},
                    {label: 'Frutose'},
                    {label: 'Histamina'},
                    {label: 'Sulfito'},
                    {label: 'Sorbitol'},
                    {label: 'Aditivos'},
                    {label: 'Corantes'},
                    {label: 'Conservantes'},
                    {label: 'Origem Animal'},
                ]}/>

                <CustomPicker label="Condiçoes Médicas" setValue={Condicoes} onValueChange={setCondicoes} options={[
                    {label: "Diabetes"},
                    {label: "Hipertensão"},
                    {label: "Obesidade"},
                    {label: "Anemia"},
                    {label: "Câncer"},
                    {label: "Doenças Cardiovasculares"},
                    {label: "Doenças Renais"},
                    {label: "Doenças Hepáticas"},
                    {label: "Doenças Gastrointestinais"},
                    {label: "Doenças Autoimunes"},
                    {label: "Doenças Respiratórias"},
                    {label: "Doenças Neurológicas"},
                    {label: "Doenças Endócrinas"},
                    {label: "Doenças Infecciosas"},
                    {label: "Doenças Psiquiátricas"},
                    {label: "Doenças Musculoesqueléticas"},
                    {label: "Doenças Dermatológicas"},
                ]}/>

                <View style={styles.rtButton}>
                <CustomButton title="Salvar" modeButton={true} onPress={()=>navigate.goBack()}/>
                </View>

            </View>

        </SafeAreaView>
    );
}

