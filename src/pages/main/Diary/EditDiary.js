import {View, SafeAreaView, ImageBackground, StyleSheet, Alert, useColorScheme, TouchableOpacity, Text} from 'react-native';
import CustomField from '../../../components/CustomField';
import CustomButton from '../../../components/CustomButton.js';
import React, { useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { getDatabase, ref, remove, update } from 'firebase/database';
import { auth } from '../../../database/firebase';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CustomPicker from '../../../components/CustomPicker';
import { Ionicons } from 'react-native-vector-icons';


export default function EditDiary(){
    
    const colorSheme = useColorScheme();

    const background = colorSheme === 'dark'? "#1C1C1E" : "#F2F2F2"
    const texts = colorSheme === 'dark'? "#F2F2F2" : "#1C1C1E"

    const route = useRoute();
    const navigation = useNavigation();
    const {id, alimentos: alimentosParam, hora, refeicao, tipo_refeicao} = route.params;

    const [editRefeicao, setEditRefeicao] = useState(refeicao);
    const [editHora, setEditHora] = useState(hora);
    const [tipoRefeicao, setTipoRefeicao] = useState('');

    const [alimentoInput, setAlimentoInput] = useState('');
    const alimentosIniciais = Array.isArray(alimentosParam) && alimentosParam.length > 0
        ? alimentosParam
        : (Array.isArray(refeicao) && refeicao.length > 0
            ? refeicao
            : (Array.isArray(tipo_refeicao) && tipo_refeicao.length > 0
                ? tipo_refeicao
                : (typeof refeicao === 'string' && refeicao ? [refeicao] : [])));

    const [alimentosAgenda, setAlimentosAgenda] = useState(alimentosIniciais);
    const [showAll, setShowAll] = useState(false);

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

    const adicionarAlimento = () => {
        const valor = alimentoInput.trim();
        if (valor.length > 0 && !alimentosAgenda.includes(valor)) {
            setAlimentosAgenda(prev => [...prev, valor]);
            setAlimentoInput('');
        }
    };

    const removerAlimento = (alimento) => {
        setAlimentosAgenda(prev => prev.filter(a => a !== alimento));
    };

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
                alimentos: alimentosAgenda,
                hora: editHora,
                tipo_refeicao: tipoRefeicao
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

                    {Array.isArray(alimentosAgenda) && alimentosAgenda.length > 0 && (
                        <View style={{ width: '100%', marginVertical: 8 }}>
                            {alimentosAgenda.filter(Boolean).map((alimento, idx) => (
                                <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#E5E5EA', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 8 }}>
                                    <Text style={{ color: '#222', fontSize: 16, fontWeight: 'bold', marginRight: 8 }}>{idx + 1}.</Text>
                                    <CustomField
                                        title={''}
                                        placeholder='Alimento'
                                        value={alimento}
                                        setValue={novo => {
                                            setAlimentosAgenda(prev => prev.map((a, i) => i === idx ? novo : a));
                                        }}
                                        style={{ flex: 1, marginRight: 8 }}
                                    />
                                    <TouchableOpacity onPress={() => removerAlimento(alimento)} style={{ marginLeft: 6 }}>
                                        <Ionicons name="close-circle" size={20} color="#FF3B30" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    )}

                    <View style={{ width: '100%', marginBottom: 8 }}>
                        <TouchableOpacity
                            onPress={showTimePicker}
                            activeOpacity={0.8}
                            style={{ width: '100%' }}
                        >
                            <View style={{ position: 'relative', width: '100%' }}>
                                <Ionicons name="time-outline" size={22} color="#2E8331" style={{ position: 'absolute', left: 18, top: 32, zIndex: 2 }} />
                                <CustomField
                                    title="Horário"
                                    placeholder="00:00"
                                    value={editHora}
                                    setValue={text => {
                                        let val = text.replace(/[^0-9:]/g, '');
                                        if (val.length === 2 && editHora.length === 1) val += ':';
                                        setEditHora(val);
                                    }}
                                    maxLength={5}
                                    keyboardType="numeric"
                                    editable={true}
                                    style={{ paddingLeft: 40, backgroundColor: '#fff', borderColor: '#2E8331', borderWidth: 2, borderRadius: 8, color: '#222' }}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <DateTimePickerModal
                        isVisible={isTimePickerVisible}
                        mode="time"
                        onConfirm={(time) => {
                            const hours = time.getHours().toString().padStart(2, '0');
                            const minutes = time.getMinutes().toString().padStart(2, '0');
                            setEditHora(`${hours}:${minutes}`);
                            hideTimePicker();
                        }}
                        onCancel={hideTimePicker}
                    />

                    <CustomButton title="Salvar" onPress={salvarAgenda} modeButton={true} size="large" style={{width: '100%', marginTop: 16}}/>
                    <CustomButton title="Excluir" onPress={excluirAgenda} modeButton={false} size="large" variant="danger" style={{width: '100%', marginTop: 8}}/>

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
