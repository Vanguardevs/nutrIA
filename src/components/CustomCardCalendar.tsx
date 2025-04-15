import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface CustomCard{
    horario:string;
    alimentacao:string;
    onPressEdit: ()=>void;
}

const CardCustomCalendar = ({horario, alimentacao, onPressEdit}:CustomCard) =>{
    return(
        <View style={styles.container}>

            <View style={{flexDirection: 'row', justifyContent: 'space-between', position: 'relative'}}>

                <View></View>
                <Text style={{textTransform: 'uppercase', fontWeight: 'bold', textAlign: 'center', fontSize: 19, marginLeft: '8%'}}>{alimentacao}</Text>
                <TouchableOpacity onPress={onPressEdit}>
                    <Ionicons name="create-outline" size={42} color="black"/>
                </TouchableOpacity>

            </View>

            <View style={{alignContent: 'center', justifyContent: 'center', alignItems: 'center'}}>
                <View style={{backgroundColor:'black', width:'30%'}}>
                    <Text style={{color: 'white'}}>{horario}</Text>
                </View>
            </View>

            <View style={{justifyContent:'center', alignContent:'center', alignItems:'center'}}>
                <TouchableOpacity style={{justifyContent:'center', alignItems: 'center'}}>
                    <Ionicons name="thumbs-up" size={53} color="black"/>
                    <Text style={{textTransform: 'uppercase', fontWeight: 'bold', textAlign: 'center'}}>concluido</Text>
                </TouchableOpacity>
            </View>


        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        alignContent: 'center',
        justifyContent:'center',
        width: '70%',
        height: 150,
        backgroundColor: 'gray',
        borderRadius: 20,
        marginTop: 5.5,
        shadowColor: '#000',
        shadowOffset: { width: -1.5, height: 1.8},
        shadowOpacity: 1.5,
        shadowRadius: 1,  
        elevation: 8
    }
})

export default CardCustomCalendar;