import React, { useLayoutEffect, useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import foods from '../foods.json';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const TAB_BAR_HEIGHT = Math.round(SCREEN_HEIGHT * 0.08);

export default function ResumoDiario({ route, navigation }) {
    const { comidos = [], naoComidos = [] } = route.params || {};
    const [alimentosDetalhes, setAlimentosDetalhes] = useState({});

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

    const normalizarTexto = (texto) => texto.trim().toLowerCase();

    const removerParenteses = (texto) => texto.replace(/\([^)]*\)/g, '').trim();

    useEffect(() => {
        const detalhes = {};

        foods.forEach(item => {
            const nomeParaBusca = normalizarTexto(removerParenteses(item.descricao));
            const nutrientes = item.nutrientes;

            const kcalObj = nutrientes.find(n =>
                n.Componente.trim().toLowerCase() === 'energia' &&
                n.Unidades.trim().toLowerCase() === 'kcal'
            );

            const kjObj = nutrientes.find(n =>
                n.Componente.trim().toLowerCase() === 'energia' &&
                n.Unidades.trim().toLowerCase() === 'kj'
            );

            const calorias = kcalObj ? parseFloat(kcalObj['Valor por 100g'].replace(',', '.')) : 0;
            const valorEnergetico = kjObj ? parseFloat(kjObj['Valor por 100g'].replace(',', '.')) : 0;

            if (calorias || valorEnergetico) {
                detalhes[nomeParaBusca] = {
                    calorias,
                    valorEnergetico,
                    descricaoOriginal: item.descricao
                };
            }
        });

        setAlimentosDetalhes(detalhes);
    }, []);

    const buscarDetalheAlimento = (nome) => {
    const nomeNormalizado = normalizarTexto(removerParenteses(nome));

    // 1. Busca exata
    if (alimentosDetalhes[nomeNormalizado]) {
        return alimentosDetalhes[nomeNormalizado];
    }

    const escapeRegex = (texto) => {
        return texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    // 2. Busca por palavras sequenciais
    const palavrasBusca = nomeNormalizado.split(' ').filter(Boolean);
    const regexSequencia = new RegExp(palavrasBusca.map(escapeRegex).join('.*'), 'i');

    for (const chave in alimentosDetalhes) {
        if (regexSequencia.test(chave)) {
            return alimentosDetalhes[chave];
        }
    }

    // 3. Busca por substring simples
    for (const chave in alimentosDetalhes) {
        if (chave.includes(nomeNormalizado)) {
            return alimentosDetalhes[chave];
        }
    }

    return null;
};

    const calcularTotais = (lista) => {
        return lista.reduce((totais, item) => {
            const detalhe = buscarDetalheAlimento(item);
            if (detalhe) {
                totais.calorias += detalhe.calorias;
                totais.energia += detalhe.valorEnergetico;
            }
            return totais;
        }, { calorias: 0, energia: 0 });
    };

    const renderAlimentos = (lista) => {
        return lista.map((item, index) => {
            const detalhe = buscarDetalheAlimento(item);
            return (
                <View key={index} style={styles.itemCard}>
                    <Text style={styles.nome}>
                        {detalhe ? detalhe.descricaoOriginal : item}
                    </Text>
                    {detalhe ? (
                        <Text style={styles.detalhe}>
                            Calorias: {detalhe.calorias} kcal | Valor energético: {detalhe.valorEnergetico} kJ
                        </Text>
                    ) : (
                        <Text style={styles.detalhe}>Dados nutricionais não encontrados.</Text>
                    )}
                </View>
            );
        });
    };

    const totaisComidos = calcularTotais(comidos);
    const totaisNaoComidos = calcularTotais(naoComidos);

    const totalCalorias = totaisComidos.calorias + totaisNaoComidos.calorias;
    const totalValorEnergetico = totaisComidos.energia + totaisNaoComidos.energia;

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
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