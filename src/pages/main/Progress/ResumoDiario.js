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
                <View key={index} style={styles.itemCard}>
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
            <Text style={styles.title}>🍽️ Alimentos Comidos</Text>
            {comidos.length ? renderAlimentos(comidos) : <Text style={styles.vazio}>Nenhum alimento comido.</Text>}

            <Text style={styles.title}>🥄 Alimentos Não Comidos</Text>
            {naoComidos.length ? renderAlimentos(naoComidos) : <Text style={styles.vazio}>Nenhum alimento ignorado.</Text>}

            <View style={styles.totalContainer}>
                <Text style={styles.totalTitle}>Resumo Nutricional</Text>
                <Text style={styles.totalText}>🔥 Calorias Totais: {totalCalorias} kcal</Text>
                <Text style={styles.totalText}>⚡ Valor Energético Total: {totalValorEnergetico} kJ</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f7f9fc',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        marginVertical: 12,
        color: '#333',
    },
    itemCard: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    nome: {
        fontSize: 18,
        fontWeight: '500',
        color: '#222',
        marginBottom: 4,
    },
    detalhe: {
        fontSize: 14,
        color: '#666',
    },
    totalContainer: {
        marginTop: 30,
        padding: 20,
        backgroundColor: '#e6f0ff',
        borderRadius: 12,
        borderLeftWidth: 5,
        borderLeftColor: '#4a90e2',
    },
    totalTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        color: '#2b4c7e',
    },
    totalText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#2b4c7e',
    },
    vazio: {
        fontStyle: 'italic',
        color: '#999',
        marginBottom: 10,
        marginLeft: 4,
    },
});
