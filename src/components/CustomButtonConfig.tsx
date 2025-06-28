import { TouchableOpacity, Text, Image, StyleSheet, View } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme/theme';

interface CustomCard{
    title: string;
    onPress:()=>void;
    nameImg: string
}

const CustomCardO = ({title, onPress, nameImg}: CustomCard)=>{
    const { borderRadius } = useTheme();
    return(
        <TouchableOpacity style={[styles.cardClicker, { borderRadius: borderRadius.lg }]} onPress={onPress}>
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
        backgroundColor: '#fff',
        margin: 10,
        borderColor: '#2E8331',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,  
        elevation: 3
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
        textAlign: 'center',
        overflow: 'visible'
    },
    imageCard:{
        margin: 7
    }
})

export default CustomCardO;