import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface CustomCard {
    horario: string;
    alimentacao: string;
    onPressEdit: () => void;
}

const CardCustomCalendar = ({horario, alimentacao, onPressEdit}: CustomCard) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.alimentacaoText}>{alimentacao}</Text>
                <TouchableOpacity onPress={onPressEdit}>
                    <Ionicons name="create-outline" size={28} color="#4CAF50" />
                </TouchableOpacity>
            </View>

            <View style={styles.horarioContainer}>
                <View style={styles.horarioBox}>
                    <Text style={styles.horarioText}>{horario}</Text>
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.concluidoButton}>
                    <Ionicons name="thumbs-up" size={32} color="#FFF" />
                    <Text style={styles.concluidoText}>Concluído</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignContent: 'center',
        justifyContent: 'center',
        width: '80%',
        height: 180,
        backgroundColor: '#F5F5F5',
        borderRadius: 15,
        marginTop: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    alimentacaoText: {
        textTransform: 'uppercase',
        fontWeight: 'bold',
        fontSize: 18,
        color: '#333',
    },
    horarioContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    horarioBox: {
        backgroundColor: '#4CAF50',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 10,
    },
    horarioText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    footer: {
        alignItems: 'center',
    },
    concluidoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4CAF50',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    concluidoText: {
        textTransform: 'uppercase',
        fontWeight: 'bold',
        fontSize: 14,
        color: '#FFF',
        marginLeft: 8,
    },
});

export default CardCustomCalendar;