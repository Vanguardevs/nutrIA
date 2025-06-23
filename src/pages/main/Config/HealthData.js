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
        // Permitir apenas números e vírgula/ponto, limitar a 4 caracteres (ex: 1,75)
        let alturaFormatada = input.replace(/[^0-9.,]/g, '');
        // Substituir vírgula por ponto para padronizar
        alturaFormatada = alturaFormatada.replace(',', '.');
        // Limitar a 4 caracteres (ex: 1.75)
        if (alturaFormatada.length > 4) alturaFormatada = alturaFormatada.slice(0, 4);
        setAltura(alturaFormatada);
    }

    function validarAltura(altura) {
        if (!altura || altura.length === 0) return false;
        
        const alturaNum = parseFloat(altura.replace(',', '.'));
        if (isNaN(alturaNum)) return false;
        
        return alturaNum >= 1.30 && alturaNum <= 2.10;
    }

    function handlePeso(input) {
        // Permitir apenas números
        let pesoNumeros = input.replace(/[^0-9]/g, '');
        let pesoFormatado = pesoNumeros;
        // Só inserir vírgula após 3 dígitos
        if (pesoNumeros.length > 3) {
            pesoFormatado = pesoNumeros.slice(0, 3) + ',' + pesoNumeros.slice(3, 6);
        }
        // Limitar a 6 caracteres totais (incluindo vírgula)
        if (pesoFormatado.length > 6) pesoFormatado = pesoFormatado.slice(0, 6);
        setPeso(pesoFormatado);
    }

    function validarPeso(peso) {
        if (!peso || peso.length === 0) return false;
        
        const pesoNum = parseFloat(peso.replace(',', '.'));
        if (isNaN(pesoNum)) return false;
        
        return pesoNum >= 20 && pesoNum <= 400;
    }

    function salvarDados() {
        if (altura.length === 0 || peso.length === 0) {
            Alert.alert("Campos Vazios", "Por favor, preencha altura e peso.");
            return;
        }

        // Validar altura
        if (!validarAltura(altura)) {
            Alert.alert("Altura Inválida", "A altura deve estar entre 1,30 e 2,10 metros. Exemplo: 1,75");
            return;
        }

        // Validar peso
        if (!validarPeso(peso)) {
            Alert.alert("Peso Inválido", "O peso deve estar entre 20 e 400 kg. Exemplo: 70,5");
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
                        placeholder="Ex: 1,75 (1,30 - 2,10)"
                        value={altura}
                        setValue={handleAltura}
                        keyboardType="decimal-pad"
                />
                    
                <CustomField
                        title="Peso (kg)"
                        placeholder="Ex: 70,5 (20 - 400 kg)"
                        value={peso}
                        setValue={handlePeso}
                        keyboardType="decimal-pad"
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
                            size="large"
                            style={{width: '100%'}}
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