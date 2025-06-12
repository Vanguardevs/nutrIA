import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function ResumoDiario({ route }) {
    const { comidos = [], naoComidos = [] } = route.params || {};

    const alimentosDetalhes = {
        Banana: { calorias: 89, valorEnergetico: 370 },
        Aveia: { calorias: 389, valorEnergetico: 1630 },
        Ovos: { calorias: 155, valorEnergetico: 650 },
        Maçã: { calorias: 52, valorEnergetico: 218 },
        Iogurte: { calorias: 59, valorEnergetico: 247 },
    };

    let totalCalorias = 0;
    let totalValorEnergetico = 0;

    const renderAlimentos = (lista) => {
        return lista.map((item, index) => {
            const detalhe = alimentosDetalhes[item];
            if (detalhe) {
                totalCalorias += detalhe.calorias;
                totalValorEnergetico += detalhe.valorEnergetico;
            }
            return (
                <View key={index} style={styles.item}>
                    <Text style={styles.nome}>{item}</Text>
                    {detalhe && (
                        <Text style={styles.detalhe}>
                            Calorias: {detalhe.calorias} kcal | Valor energético: {detalhe.valorEnergetico} kJ
                        </Text>
                    )}
                </View>
            );
        });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Agendamentos Concluidos</Text>
            {renderAlimentos(comidos)}

            <Text style={styles.title}>Agendamentos não Concluidos</Text>
            {renderAlimentos(naoComidos)}

            <View style={styles.totalContainer}>
                <Text style={styles.totalText}>Total de Calorias: {totalCalorias} kcal</Text>
                <Text style={styles.totalText}>Total Valor Energético: {totalValorEnergetico} kJ</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    item: {
        marginBottom: 12,
    },
    nome: {
        fontSize: 18,
    },
    detalhe: {
        fontSize: 14,
        color: '#555',
    },
    totalContainer: {
        marginTop: 30,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingTop: 15,
    },
    totalText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});