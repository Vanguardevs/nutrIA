import {View, SafeAreaView, ImageBackground, StyleSheet, Alert, Button, useColorScheme} from 'react-native';
import CustomField from '../../../components/CustomField';
import CustomButton from '../../../components/CustomButton';
import React, { useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { getDatabase, ref, remove, update } from 'firebase/database';
import { auth } from '../../../database/firebase';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CustomPicker from '../../../components/CustomPicker';


export default function EditDiary(){
    
    const colorSheme = useColorScheme();

    const background = colorSheme === 'dark'? "#1C1C1E" : "#F2F2F2"
    const texts = colorSheme === 'dark'? "#F2F2F2" : "#1C1C1E"

    const route = useRoute();
    const navigation = useNavigation();
    const {id, refeicao, hora} = route.params;

    const [editRefeicao, setEditRefeicao] = useState(refeicao);
    const [editHora, setEditHora] = useState(hora);
    const [tipoRefeicao, setTipoRefeicao] = useState('');


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
        


    function handleHora(input){

        const apenasNumero = input.replace(/[^0-9]/g, '');

        let horaFormatada = apenasNumero;
        if(apenasNumero.length > 2){
            horaFormatada = `${apenasNumero.slice(0,2)}:${apenasNumero.slice(2,4)}`
    }
    setEditHora(horaFormatada);
}




    async function excluirAgenda(){
        try{
            const userID = auth.currentUser?.uid;
            if(!userID){
                console.log("Usuário não encontrado")
                Alert.alert("Erro", "Não foi possível encontrar o usuário no banco. Tente Novamente!");
            }

            const db = getDatabase();
            const agendaRef = ref(db, `users/${userID}/diaries/${id}`) 
            
            await remove(agendaRef)
            .then(()=>{
                console.log("Excluido com sucesso!")
                navigation.goBack()
            })

        }catch(e){
            console.log(e)
        }
    }

    async function salvarAgenda(){
        try{
            const userID = auth.currentUser?.uid;
            if(!userID){
                console.log("Usuário não encontrado")
                Alert.alert("Erro", "Não foi possível encontrar o usuário no banco. Tente Novamente!");
            }

            const db = getDatabase();
            const agendaRef = ref(db, `users/${userID}/diaries/${id}`)

            await update(agendaRef,{
                refeicao: editRefeicao,
                hora: editHora
            })
            .then(()=>{
                console.log("Atualizado com sucesso!")
                Alert.alert("Atualizado com sucesso!")
                navigation.goBack()
            })
        }
        catch(e){
            console.log(e)
            Alert.alert("Erro", "Não foi possível salvar. Tente Novamente!");
        }
    }

    return(
        <SafeAreaView style={[styles.container, {backgroundColor: background}]}>
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

                    <CustomField title="Alimento" placeholder='Alimento' value={editRefeicao} setValue={(d)=>setEditRefeicao(d)}/>
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
                    <CustomButton title="Excluir" onPress={excluirAgenda} modeButton={false}/>

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
