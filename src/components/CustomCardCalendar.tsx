import {View, StyleSheet, Text, TouchableOpacity, useColorScheme} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, { useState } from 'react';

interface CustomCard {
    horario: string;
    alimentos: string[];
    onPressEdit: () => void;
    onPressConcluido: () => void;
}

const CardCustomCalendar = ({horario, alimentos, onPressEdit, onPressConcluido}: CustomCard) => {

    const colorSheme = useColorScheme();

    const backgoundH = colorSheme === 'dark'? "#2C2C2E" : "#F5F5F5"
    const backgoundIcons = colorSheme === 'dark'? "#F2F2F2" : "#1C1C1E"
    const textColor = colorSheme === 'dark'? "#FFFFFF" : "#333333"
    const [expandido, setExpandido] = useState(false);
    const mostrarAlimentos = expandido ? alimentos : alimentos.slice(0, 4);

    return (
        <View style={[styles.container,{backgroundColor: backgoundH}]}>
            <View style={styles.header}>
                <View style={styles.alimentacaoContainer}>
                    {mostrarAlimentos.map((alimento, idx) => (
                        <Text key={idx} style={[styles.alimentacaoText,{color: textColor}]}> {idx + 1}. {alimento} </Text>
                    ))}
                    {alimentos.length > 4 && (
                        <TouchableOpacity onPress={() => setExpandido(e => !e)} style={{ marginTop: 4 }}>
                            <Text style={{ color: '#2E8331', fontWeight: 'bold', fontSize: 14 }}>{expandido ? 'Ver menos' : `Ver mais (${alimentos.length - 4})`}</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity 
                    style={styles.editButton}
                    onPress={onPressEdit}
                >
                    <Ionicons name="create-outline" size={24} color="#4CAF50" />
                </TouchableOpacity>
            </View>

            <View style={styles.horarioContainer}>
                <View style={styles.horarioBox}>
                    <Text style={styles.horarioText}>{horario}</Text>
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.concluidoButton} onPress={onPressConcluido}>
                    <Ionicons name="thumbs-up" size={24} color="#FFF" />
                    <Text style={styles.concluidoText}>Concluído</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        minHeight: 160,
        borderRadius: 15,
        marginVertical: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
        minHeight: 40,
    },
    alimentacaoContainer: {
        flex: 1,
        marginRight: 12,
        justifyContent: 'center',
    },
    alimentacaoText: {
        textTransform: 'uppercase',
        fontWeight: 'bold',
        fontSize: 16,
        lineHeight: 20,
        flexWrap: 'wrap',
    },
    editButton: {
        padding: 4,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 32,
        minHeight: 32,
    },
    horarioContainer: {
        alignItems: 'center',
        marginVertical: 12,
    },
    horarioBox: {
        backgroundColor: '#4CAF50',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 12,
        minWidth: 80,
        alignItems: 'center',
    },
    horarioText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    footer: {
        alignItems: 'center',
        marginTop: 8,
    },
    concluidoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        minHeight: 40,
    },
    concluidoText: {
        textTransform: 'uppercase',
        fontWeight: 'bold',
        fontSize: 14,
        color: '#FFF',
        marginLeft: 6,
    },
});

export default CardCustomCalendar;