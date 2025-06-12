import React, { useEffect, useState } from 'react';
import { View, ImageBackground, SafeAreaView, StyleSheet, useColorScheme, Text, ScrollView, Dimensions } from 'react-native';
import CustomButton from '../../../components/CustomButton';
import { LineChart } from 'react-native-chart-kit';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Progress() {

    const colorScheme = useColorScheme();

    const backgroundH = colorScheme === 'dark'? '#1C1C1E' : '#F2F2F2';
    const textColor = colorScheme === 'dark' ? '#fff' : '#000';
    const lineColor = colorScheme === 'dark' ? 'rgba(134, 65, 244, 0.8)' : '#6a1b9a';

    const naviagte = useNavigation();

    const [comidos, setComidos] = useState([]);
    const [naoComidos, setNaoComidos] = useState([]);

    const data = [1, 3, 2, 4, 1, 2, 5];
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

    const screenWidth = Dimensions.get('window').width - 40;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: backgroundH }]}>
            <ImageBackground
                source={require('../../../../assets/Frutas_home.png')}
                style={styles.homeBackground}
                resizeMode="cover"
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={[styles.title, { color: textColor }]}>Grafico Nutricional</Text>

                    {/* GRÁFICO */}
                    <View style={styles.chartSection}>
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
                            width={screenWidth}
                            height={220}
                            chartConfig={{
                                backgroundColor: backgroundH,
                                backgroundGradientFrom: backgroundH,
                                backgroundGradientTo: backgroundH,
                                decimalPlaces: 0,
                                color: () => textColor,
                                labelColor: () => textColor,
                                propsForDots: {
                                    r: "5",
                                    strokeWidth: "2",
                                    stroke: lineColor,
                                },
                            }}
                            bezier
                            style={{
                                borderRadius: 16,
                            }}
                        />
                    </View>

                    {/* BOTAO PARA ALIMENTOS COMIDOS */}
                    <View style={{alignItems: 'center', marginBottom: 10, marginTop: 10}}>
                        <CustomButton title="Alimentos Comidos" onPress={() => naviagte.navigate('ResumoDiario', { comidos, naoComidos })} modeButton={true} />
                    </View>

                    {/* COMIDO */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <MaterialIcons name="check-box" size={24} color="green" />
                            <Text style={[styles.sectionTitle, { color: textColor }]}>Alimentos Comidos</Text>
                        </View>
                        {comidos.map((alimento, index) => (
                            <Text key={index} style={[styles.item, { color: textColor }]}>• {alimento}</Text>
                        ))}
                    </View>
                    
                    {/* NAO COMIDO */}
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
        textAlign: 'center'
    },
    chartSection: {
        width: '100%',
        marginBottom: 30,
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