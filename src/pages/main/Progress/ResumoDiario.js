import React, { useLayoutEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import CustomButton from '../../../components/CustomButton.js';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const TAB_BAR_HEIGHT = Math.round(SCREEN_HEIGHT * 0.08); // 8% da tela, igual ao appRoute.js

export default function ResumoDiario({ route, navigation }) {
    const { comidos = [], naoComidos = [] } = route.params || {};

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: 'Resumo Diário',
            headerTitleStyle: {
                color: '#FFFFFF',
                fontWeight: 'bold',
                fontSize: 24,
                alignSelf: 'center',
            },
        });
    }, [navigation]);

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
                    {detalhe ? (
                        <Text style={styles.detalhe}>
                            Calorias: {detalhe.calorias} kcal | Valor energético: {detalhe.valorEnergetico} kJ
                        </Text>
                    ) : null}
                </View>
            );
        });
    };

    return (
        <View style={{flex: 1, backgroundColor: '#fff'}}>
            <ScrollView contentContainerStyle={[
              styles.container,
              {
                paddingBottom: TAB_BAR_HEIGHT + 16,
                minHeight: (comidos.length + naoComidos.length) === 0 ? SCREEN_HEIGHT * 0.7 : undefined
              }
            ]}>
                <Text style={styles.title}>🍽️ Refeições Realizadas</Text>
                {comidos.length ? renderAlimentos(comidos) : <Text style={styles.vazio}>Nenhuma refeição realizada.</Text>}

                <Text style={styles.title}>🍃 Refeições Não Realizadas</Text>
                {naoComidos.length ? renderAlimentos(naoComidos) : <Text style={styles.vazio}>Nenhuma refeição não realizada.</Text>}

                <View style={styles.totalContainer}>
                    <Text style={styles.totalTitle}>Resumo Nutricional</Text>
                    <Text style={styles.totalText}>🔥 Calorias Totais: {totalCalorias} kcal</Text>
                    <Text style={styles.totalText}>⚡ Valor Energético Total: {totalValorEnergetico} kJ</Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        marginVertical: 12,
        color: '#2E8331',
        textAlign: 'center',
    },
    itemCard: {
        backgroundColor: '#D0F5D8',
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
        fontSize: 22,
        fontWeight: '500',
        color: '#2E8331',
        marginBottom: 4,
    },
    detalhe: {
        fontSize: 16,
        color: '#1C1C1E',
    },
    totalContainer: {
        marginTop: 30,
        padding: 20,
        backgroundColor: '#2E8331',
        borderRadius: 12,
        borderLeftWidth: 5,
        borderLeftColor: '#14591A',
    },
    totalTitle: {
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 8,
        color: '#D0F5D8',
    },
    totalText: {
        fontSize: 20,
        fontWeight: '500',
        color: '#D0F5D8',
    },
    vazio: {
        fontStyle: 'italic',
        color: '#2E8331',
        marginBottom: 10,
        marginLeft: 4,
    },
});
