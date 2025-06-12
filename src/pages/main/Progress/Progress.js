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

    const backgroundH = colorScheme === 'dark'? '#1C1C1E' : '#F2F2F2';
    const textColor = colorScheme === 'dark' ? '#fff' : '#000';
    const lineColor = colorScheme === 'dark' ? 'rgba(134, 65, 244, 0.8)' : '#6a1b9a';

    const naviagte = useNavigation();

    const [comidos, setComidos] = useState([]);
    const [agendamentos, setAgendamentos] = useState([]);
    const [naoComidos, setNaoComidos] = useState([]);
    const [quantidade, setQuantidade] = useState([0]);

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
            } else {
                console.warn('Nenhum dado encontrado ou formato inválido.');
                setComidos([]);
                setNaoComidos([]);
            }
        }, (error) => {
            console.error('Erro ao acessar o banco de dados:', error);
        });
        
        return () => unsubscribe();
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
                                        data: [0,1,2,3,4,5,6],
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
        height: 'auto',
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
        marginBottom: '20%'
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