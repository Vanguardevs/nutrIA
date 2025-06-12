import React, { useEffect, useState } from 'react';
import {View, ImageBackground, SafeAreaView, StyleSheet, useColorScheme, Text, ScrollView, Dimensions,} from 'react-native';
import CustomButton from '../../../components/CustomButton';
import { LineChart } from 'react-native-chart-kit';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Progress() {
    const colorScheme = useColorScheme();

    const backgroundH = colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F2';
    const textColor = colorScheme === 'dark' ? '#fff' : '#000';
    const cardBackground = colorScheme === 'dark' ? '#2c2c2e' : '#fff';
    const lineColor = colorScheme === 'dark' ? 'rgba(134, 65, 244, 0.8)' : '#6a1b9a';

    const navigate = useNavigation();

    const [comidos, setComidos] = useState([]);
    const [naoComidos, setNaoComidos] = useState([]);

    const data = [1, 3, 2, 4, 0, 2, 5];
    const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

    useEffect(() => {
        const dadosExemplo = [
            { alimento: 'Banana', comido: true },
            { alimento: 'Aveia', comido: true },
            { alimento: 'Ovos', comido: true },
            { alimento: 'Maçã', comido: false },
            { alimento: 'Iogurte', comido: false },
        ];

        const comidos = dadosExemplo.filter(item => item.comido).map(item => item.alimento);
        const naoComidos = dadosExemplo.filter(item => !item.comido).map(item => item.alimento);

        setComidos(comidos);
        setNaoComidos(naoComidos);
    }, []);

    const screenWidth = Dimensions.get('window').width;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: backgroundH }]}>
            <ImageBackground
                source={require('../../../../assets/Frutas_home.png')}
                style={styles.homeBackground}
                resizeMode="cover"
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={[styles.title, { color: textColor }]}>📊 Gráfico Nutricional</Text>

                    <View style={[styles.chartSection, styles.card, { backgroundColor: cardBackground }]}>
                        <LineChart
                            data={{
                                labels: days,
                                datasets: [
                                    {
                                        data: data,
                                        color: () => lineColor,
                                        strokeWidth: 2,
                                    },
                                ],
                            }}
                            width={screenWidth - 72}
                            height={220}
                            chartConfig={{
                                backgroundColor: backgroundH,
                                backgroundGradientFrom: backgroundH,
                                backgroundGradientTo: backgroundH,
                                decimalPlaces: 0,
                                color: () => textColor,
                                labelColor: () => textColor,
                                propsForDots: {
                                    r: '5',
                                    strokeWidth: '2',
                                    stroke: lineColor,
                                },
                            }}
                            bezier
                            style={{
                                borderRadius: 16,
                            }}
                        />
                    </View>

                    <View style={styles.buttonWrapper}>
                        <CustomButton
                            title="Ver Resumo Diário"
                            onPress={() => navigate.navigate('ResumoDiario', { comidos, naoComidos })}
                            modeButton={true}
                        />
                    </View>

                    <View style={[styles.card, { backgroundColor: cardBackground }]}>
                        <View style={styles.sectionHeader}>
                            <MaterialIcons name="check-box" size={24} color="green" />
                            <Text style={[styles.sectionTitle, { color: textColor }]}>Alimentos Comidos</Text>
                        </View>
                        {comidos.map((alimento, index) => (
                            <Text key={index} style={[styles.item, { color: textColor }]}>• {alimento}</Text>
                        ))}
                    </View>

                    <View style={[styles.card, { backgroundColor: cardBackground }]}>
                        <View style={styles.sectionHeader}>
                            <MaterialIcons name="cancel" size={24} color="red" />
                            <Text style={[styles.sectionTitle, { color: textColor }]}>Alimentos Não Comidos</Text>
                        </View>
                        {naoComidos.map((alimento, index) => (
                            <Text key={index} style={[styles.item, { color: textColor }]}>• {alimento}</Text>
                        ))}
                    </View>
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    homeBackground: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    scrollContent: {
        alignItems: 'center',
        padding: 20,
        paddingBottom: 40,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginBottom: 20,
    },
    chartSection: {
        width: '100%',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginBottom: 20,
    },
    buttonWrapper: {
        marginVertical: 10,
        width: '100%',
        alignItems: 'center',
    },
    card: {
        width: '100%',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 3,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginLeft: 8,
    },
    item: {
        fontSize: 16,
        marginLeft: 8,
        marginBottom: 6,
    },
});