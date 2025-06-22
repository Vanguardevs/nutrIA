import React, { useState, useEffect } from 'react';
import CustomButton from '../../../components/CustomButton.js';
import CustomField from '../../../components/CustomField';
import { View, SafeAreaView, Text, useColorScheme, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';
import { getDatabase, onValue, ref, update } from 'firebase/database';
import { auth } from '../../../database/firebase';
import { useNavigation } from '@react-navigation/native';

export default function HealthData() {
    const navigation = useNavigation();
    const colorScheme = useColorScheme();

    const background = colorScheme === 'dark' ? "#1C1C1E" : "#F2F2F2";
    const textColor = colorScheme === 'dark' ? "#F2F2F2" : "#1C1C1E";
    const cardBackground = colorScheme === 'dark' ? "rgba(44,44,46,0.85)" : "rgba(255,255,255,0.85)";

    const [altura, setAltura] = useState('');
    const [peso, setPeso] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const db = getDatabase();
        const userId = auth.currentUser?.uid;
        const userRef = ref(db, `users/${userId}/`);

        onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setAltura(data.altura ? data.altura.toString() : '');
                setPeso(data.peso ? data.peso.toString() : '');
                console.log('Dados de saúde carregados:', { altura: data.altura, peso: data.peso });
            }
            setLoading(false);
        });
    }, []);

    function handleAltura(input) {
        let alturaFormatada = input.replace(/[^0-9]/g, '').slice(0, 3);
        let alturaFormatada2 = alturaFormatada;
        if (alturaFormatada.length > 1) {
            alturaFormatada2 = `${alturaFormatada.slice(0, 1)}.${alturaFormatada.slice(1, 3)}`;
        }
        setAltura(alturaFormatada2);
    }

    function handlePeso(input) {
        let pesoFormatado = input.replace(/[^0-9]/g, '').slice(0, 3);
        let pesoFormatado2 = pesoFormatado;
        if (pesoFormatado.length > 1) {
            pesoFormatado2 = `${pesoFormatado.slice(0, 2)},${pesoFormatado.slice(2, 3) || '0'}`;
        }
        setPeso(pesoFormatado2);
    }

    function salvarDados() {
        if (altura.length === 0 || peso.length === 0) {
            Alert.alert("Campos Vazios", "Por favor, preencha altura e peso.");
            return;
        }

        const db = getDatabase();
        const userId = auth.currentUser?.uid;
        const userRef = ref(db, `users/${userId}/`);

        update(userRef, {
            altura: altura,
            peso: peso
        })
        .then(() => {
            console.log('Dados de saúde atualizados com sucesso!');
            Alert.alert('Sucesso', 'Dados de saúde atualizados com sucesso!');
        })
        .catch((error) => {
            console.error('Erro ao atualizar dados de saúde:', error);
            Alert.alert('Erro', 'Não foi possível atualizar os dados. Tente novamente.');
        });
    }

    if (loading) {
        return (
            <SafeAreaView style={[styles.safeArea, { backgroundColor: background }]}>
                <View style={styles.loadingContainer}>
                    <Text style={[styles.loadingText, { color: textColor }]}>Carregando dados...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: background }]}>
            <ImageBackground
                source={require('../../../../assets/frutas_fundo.png')}
                style={styles.imageBackground}
                imageStyle={{ opacity: 0.5 }}
            >
                <View style={[styles.container, { backgroundColor: cardBackground }]}>
                    <Text style={[styles.title, { color: textColor }]}>Dados de Saúde</Text>
                    <Text style={[styles.subtitle, { color: colorScheme === 'dark' ? '#8E8E93' : '#6C757D' }]}>
                        Atualize suas medidas corporais
                    </Text>

                    <CustomField
                        title="Altura (metros)"
                        placeholder="Ex: 1.75"
                        value={altura}
                        setValue={handleAltura}
                        keyboardType="numeric"
                    />
                    
                    <CustomField
                        title="Peso (kg)"
                        placeholder="Ex: 70,5"
                        value={peso}
                        setValue={handlePeso}
                        keyboardType="numeric"
                    />

                    <TouchableOpacity 
                        onPress={() => navigation.navigate("EditHealth")} 
                        style={[styles.medicalButton, { backgroundColor: colorScheme === 'dark' ? '#2E8331' : '#28A745' }]}
                    >
                        <Text style={[styles.medicalButtonText, { color: '#FFFFFF' }]}>
                            📋 Condições Médicas
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.buttonContainer}>
                        <CustomButton
                            title="Salvar Dados"
                            modeButton={true}
                            onPress={salvarDados}
                        />
                    </View>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    imageBackground: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        width: '90%',
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '400',
        marginBottom: 20,
        textAlign: 'center',
    },
    medicalButton: {
        marginTop: 20,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    medicalButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    buttonContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
        fontWeight: '500',
    },
});