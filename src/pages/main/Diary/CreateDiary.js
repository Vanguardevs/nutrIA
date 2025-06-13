import {View, SafeAreaView, ImageBackground, StyleSheet, Alert, useColorScheme, Button} from 'react-native';
import CustomField from '../../../components/CustomField';
import CustomPicker from '../../../components/CustomPicker';
import CustomButton from '../../../components/CustomButton';
import React,{ useEffect, useState } from 'react';
import { push, getDatabase, ref, set } from 'firebase/database';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { auth } from '../../../database/firebase';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';


export default function CreateDiary(){

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false); 
    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };
    const handleConfirm = (date) => {
        console.warn("A date has been picked: ", date);
        hideDatePicker();
    };


    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
    const showTimePicker = () => {
        setTimePickerVisibility(true);
    };
    const hideTimePicker = () => {
        setTimePickerVisibility(false);
    };
    const handleTimeConfirm = (time) => {
        console.warn("A Time has been picked: ", time);
        hideTimePicker();
    };
    

    const colorSheme = useColorScheme();
    
    const backgoundH = colorSheme === 'dark'? "#1C1C1E" : "#F2F2F2"
    const backgoundIcons = colorSheme === 'dark'? "#F2F2F2" : "#1C1C1E"

    const [refeicao, setRefeicao] = useState('');
    const [hora, setHora] = useState('');
    const [tipoRefeicao, setTipoRefeicao] = useState('');
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();

    function handleHora(input){

        const apenasNumero = input.replace(/[^0-9]/g, '');

        let horaFormatada = apenasNumero;
        if(apenasNumero.length > 2){
            horaFormatada = `${apenasNumero.slice(0,2)}:${apenasNumero.slice(2,4)}`
    }
    setHora(horaFormatada);
}

    async function salvarAgenda(){
        if(refeicao == '' || hora == '' || tipoRefeicao == ''){
            Alert.alert("Tente novamente", "Alguns dos campos de cadastro estão vazios");
            console.log("Alguns dos campos de cadastro estão vazios")
            return;
        }

        setLoading(true);

        try{
            
            const data = {
                "tipo_refeicao": tipoRefeicao,
                "refeicao": refeicao,
                "horario": hora,
                "id_user": auth.currentUser.uid
            }

            axios.post("https://nutria-6uny.onrender.com/calories", data)
            .then((resp)=>{
                console.log("RESPONSE " + resp.data)
                Alert.alert("Cadastrado sua agenda com sucesso!");
                navigation.goBack();
            })
            .catch((e)=>{
                console.log("ERROR " + e)
            })
        }
        catch(error){
            console.log("ERROR " + error)
            Alert.alert("ERROR", "Erro ao cadastrar a agenda no banco de dados")
        }
        finally{
            setLoading(false);
        }
    }
    

    return(
        <SafeAreaView style={[styles.container,{backgroundColor:backgoundH}]}>

            <ImageBackground source={require('../../../../assets/Frutas_home.png')} style={styles.imgBackgound}>
                
                <View style={styles.container_items}>


                    <CustomPicker
                        label="Refeição"
                        selectedValue={tipoRefeicao}
                        onValueChange={setTipoRefeicao}
                        options={[
                            {label:'Café da Manhã', value:'Café da Manhã'}, 
                            {label:'Almoço', value:'Almoço'}, 
                            {label:'Jantar', value:'Jantar'}, 
                            {label:'Lanche da Tarde', value:'Lanche da Tarde'}
                        ]}
                    />
                    <CustomField title="Refeição" placeholder='Refeição' value={refeicao} setValue={(d)=>setRefeicao(d)}/>

                    <Button title="Data" onPress={showDatePicker} value/>
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                    />

                    <Button title="Horário" onPress={showTimePicker} />
                    <DateTimePickerModal
                        isVisible={isTimePickerVisible}
                        mode="time"
                        onConfirm={handleTimeConfirm}
                        onCancel={hideTimePicker}
                    />

                    <CustomButton title="Salvar" onPress={salvarAgenda} modeButton={true}/>

                </View>

            </ImageBackground>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center'
    },
    container_items:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        marginTop: '10%',
        marginBottom: '10%',
        padding: 20,
    },
    imgBackgound:{
        height: '100%',
        width: '100%',
    }
})
