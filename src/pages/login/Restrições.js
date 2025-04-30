import { SafeAreaView, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import CustomField from "../../components/CustomField";
import React, {useEffect, useState} from "react";
import CustomPicker from "../../components/CustomPicker";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";

export default function Restricoes() {

    const navigate = useNavigation();
    const [Alergias, setAlergias] = useState();
    const [intolerâncias, setIntolerâncias] = useState();
    const [Condicoes, setCondicoes] = useState();

    return(
        <SafeAreaView style={styles.container}>
            
            <View style={{alignItems: 'center'}}>

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

                <CustomButton title="Salvar" modeButton={true} onPress={()=>navigate.goBack()}/>

            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff',
        width: '100%'
    }
})