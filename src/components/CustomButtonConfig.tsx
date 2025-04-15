import { TouchableOpacity, Text, Image, StyleSheet, View } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Theme from "../theme/theme";

interface CustomCard{
    title: string;
    onPress:()=>void;
    nameImg: string
}

const CustomCardO = ({title, onPress, nameImg}: CustomCard)=>{
    return(
        <TouchableOpacity style={styles.cardClicker} onPress={onPress}>
            <View style={styles.componentItems}>
                <Ionicons name={nameImg} size={42} color='black' style={styles.imageCard}/>
                <Text style={styles.title}>{title}</Text>
                <View></View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    cardClicker:{
        backgroundColor: '#c8c8c8',
        margin: 10,
        borderRadius: Theme.borderRadius,
        width: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,  
        elevation: 5
    },
    componentItems:{
        flexDirection: 'row',
        height: 50,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    title:{
        fontSize: 20,
        fontFamily: 'K2D-BoldItalic',
        textAlign: 'center'
    },
    imageCard:{
        margin: 7
    }
})

export default CustomCardO;