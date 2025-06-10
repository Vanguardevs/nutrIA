import React, { useEffect, useState } from 'react';
import { View, ImageBackground, SafeAreaView, StyleSheet, useColorScheme, Text, ScrollView, Button } from 'react-native';
import { LineChart, Grid, YAxis, XAxis } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Progress() {
    const navigation = useNavigation();

    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const backgroundH = isDark ? '#1C1C1E' : '#F2F2F2';
    const textColor = isDark ? '#fff' : '#000';
    const lineColor = isDark ? 'rgba(134, 65, 244, 0.8)' : '#6a1b9a';

    const [comidos, setComidos] = useState([]);
    const [naoComidos, setNaoComidos] = useState([]);

    const data = [1, 3, 2, 4, 1, 2, 5];
    const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

    useEffect(() => {
        // Mudar para bagaça de APi
        const dadosExemplo = [
            { alimento: 'Banana', comido: true },
            { alimento: 'Aveia', comido: true },
            { alimento: 'Ovos', comido: true },
            { alimento: 'Maçã', comido: false },
            { alimento: 'Iogurte', comido: false },
        ];

        const comidosList = dadosExemplo.filter(item => item.comido).map(item => item.alimento);
        const naoComidosList = dadosExemplo.filter(item => !item.comido).map(item => item.alimento);

        setComidos(comidosList);
        setNaoComidos(naoComidosList);
    }, []);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: backgroundH }]}>
            <ImageBackground
                source={require('../../../assets/Frutas_home.png')}
                style={styles.homeBackground}
                resizeMode="cover"
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={[styles.title, { color: textColor }]}>Gráfico Nutricional</Text>

                    {/* GRAFICO */}
                    <View style={styles.chartSection}>
                        <View style={styles.chartRow}>
                            <YAxis
                                data={data}
                                contentInset={{ top: 20, bottom: 20 }}
                                svg={{ fill: textColor, fontSize: 12 }}
                                numberOfTicks={Math.max(...data)} // quantidade de ticks igual ao maior valor
                                formatLabel={value => Math.round(value).toString()} // mostra só números inteiros
                            />
                            <View style={{ flex: 1, marginLeft: 10 }}>
                                <LineChart
                                    style={{ height: 200 }}
                                    data={data}
                                    svg={{ stroke: lineColor, strokeWidth: 2 }}
                                    contentInset={{ top: 20, bottom: 20 }}
                                    curve={shape.curveLinear}  // linha reta, sem curva
                                >
                                    <Grid />
                                </LineChart>
                                <XAxis
                                    style={{ marginTop: 10 }}
                                    data={data}
                                    formatLabel={(value, index) => days[index]}
                                    contentInset={{ left: 10, right: 10 }}
                                    svg={{ fill: textColor, fontSize: 12 }}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Navegação Insana*/}
                    <View style={{ width: '100%', marginBottom: 30 }}>
                        <Button
                            title="Ver Resumo Diário"
                            onPress={() => navigation.navigate('ResumoDiario', { comidos, naoComidos })}
                        />
                        <View style={{ height: 10 }} />
                        <Button
                            title="Ver Resumo Semanal"
                            onPress={() => navigation.navigate('ResumoSemanal')}
                        />
                    </View>

                    {/* COMIDOS */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <MaterialIcons name="check-box" size={24} color="green" />
                            <Text style={[styles.sectionTitle, { color: textColor }]}>Alimentos Comidos</Text>
                        </View>
                        {comidos.map((alimento, index) => (
                            <Text key={index} style={[styles.item, { color: textColor }]}>• {alimento}</Text>
                        ))}
                    </View>

                    {/* NÃO COMIDOS */}
                    <View style={styles.section}>
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
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        alignSelf: 'flex-start',
    },
    chartSection: {
        width: '100%',
        marginBottom: 30,
    },
    chartRow: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
    },
    section: {
        width: '100%',
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    item: {
        fontSize: 16,
        marginLeft: 16,
        marginBottom: 4,
    },
});
