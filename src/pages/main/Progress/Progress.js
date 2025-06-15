import React, { useEffect, useState } from 'react';
import { View, ImageBackground, SafeAreaView, StyleSheet, useColorScheme, Text, ScrollView, Dimensions } from 'react-native';
import CustomButton from '../../../components/CustomButton';
import { LineChart } from 'react-native-chart-kit';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {auth} from '../../../database/firebase';
import { getDatabase, ref, onValue } from 'firebase/database';

export default function Progress() {
    const colorScheme = useColorScheme();

    const backgroundH = colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F2';
    const textColor = colorScheme === 'dark' ? '#fff' : '#000';
    const cardBackground = colorScheme === 'dark' ? '#2c2c2e' : '#fff';
    const lineColor = colorScheme === 'dark' ? 'rgba(134, 65, 244, 0.8)' : '#6a1b9a';

    const navigate = useNavigation();

    const [comidos, setComidos] = useState([]);
    const [agendamentos, setAgendamentos] = useState([]);
    const [naoComidos, setNaoComidos] = useState([]);
    const [quantidade, setQuantidade] = useState([0]);
    const [quantidadePorDia, setQuantidadePorDia] = useState([]);
    const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

    useEffect(() => {

        const db = getDatabase();
        const userId = auth.currentUser?.uid;
        const diariesRef = ref(db, `users/${userId}/diaries`);

        // Escuta mudanças em tempo real
        const unsubscribe = onValue(diariesRef, (snapshot) => {
            const data = snapshot.val();

            if (data && typeof data === 'object') {

                const diaHoje = new Date().getDay(); 

                const listaAgendas = Object.entries(data).map(([key, value]) => ({
                    id: key,
                    ...value,
                }));

                const comidosTemp = [];
                const naoComidosTemp = [];

                listaAgendas.forEach((agenda) => {
                    if (agenda.progress && Array.isArray(agenda.progress)) {
                        if (agenda.progress[diaHoje] === true) {
                            comidosTemp.push(agenda.refeicao);
                        } else {
                            naoComidosTemp.push(agenda.refeicao);
                        }
                    }
                });

                setComidos(comidosTemp);
                setNaoComidos(naoComidosTemp);

                // Inicializa um array com 7 posições (uma para cada dia da semana)
                const diasDaSemana = Array(7).fill(0);

                listaAgendas.forEach((agenda) => {
                    if (agenda.progress && Array.isArray(agenda.progress)) {
                        agenda.progress.forEach((status, dia) => {
                            if (status !== undefined) {
                                diasDaSemana[dia] += 1;
                            }
                        });
                    }
                });

                setQuantidadePorDia(diasDaSemana);
                console.log(quantidadePorDia);
            } else {
                console.warn('Nenhum dado encontrado ou formato inválido.');
                setComidos([]);
                setNaoComidos([]);
                setQuantidadePorDia(Array(7).fill(0))
            }
        }, (error) => {
            console.error('Erro ao acessar o banco de dados:', error);
        });
        
        return () => unsubscribe();
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
                                        data: [1,2,3,4,5],
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
        height: 'auto',
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
        marginBottom: 8,
        marginBottom: '5%'
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