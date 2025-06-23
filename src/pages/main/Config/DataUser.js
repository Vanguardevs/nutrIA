import React, { useEffect, useState } from 'react';
import CustomButton from '../../../components/CustomButton.js';
import CustomField from '../../../components/CustomField';
import CustomPicker from '../../../components/CustomPicker';
import { View, SafeAreaView, Text, Alert, useColorScheme, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ref, onValue, getDatabase, update } from 'firebase/database';
import { auth } from '../../../database/firebase';

export default function DataUser() {
  const colorScheme = useColorScheme();

  const background = colorScheme === 'dark' ? "#1C1C1E" : "#F2F2F2";
  const textColor = colorScheme === 'dark' ? "#F2F2F2" : "#1C1C1E";
  const cardBackground = colorScheme === 'dark' ? "rgba(44,44,46,0.85)" : "rgba(255,255,255,0.85)";

  const navigation = useNavigation();

  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [objetivo, setObjetivo] = useState('');

  useEffect(() => {
    const db = getDatabase();
    const userID = auth.currentUser.uid;
    const userRef = ref(db, 'users/' + userID);

    onValue(userRef, (resp) => {
      const data = resp.val();
      if (data) {
        setNome(data.nome || '');
        setIdade(data.idade ? data.idade.toString() : '');
        setObjetivo(data.objetivo || '');
        console.log('Dados carregados:', { nome: data.nome, idade: data.idade, objetivo: data.objetivo });
      }
    });
  }, []);

  function AtualizarDados() {
    const db = getDatabase();
    const userID = auth.currentUser.uid;
    const userRef = ref(db, 'users/' + userID);

    if (
      nome.length === 0 ||
      idade.length === 0 ||
      objetivo.length === 0
    ) {
      Alert.alert("Campos Vazios", "Por favor, preencha todos os campos obrigatórios.");
      console.log("Campos vazios detectados");
      return;
    }

    // Validar se a idade é um número válido
    const idadeNum = parseInt(idade);
    if (isNaN(idadeNum) || idadeNum < 16 || idadeNum > 100) {
      Alert.alert("Idade Inválida", "Por favor, insira uma idade válida entre 16 e 100 anos.");
      return;
    }

    update(userRef, {
      nome: nome,
      idade: idadeNum,
      objetivo: objetivo
    })
      .then(() => {
        console.log('Dados atualizados com sucesso!');
        Alert.alert('Sucesso', 'Dados pessoais atualizados com sucesso!');
        navigation.goBack();
      })
      .catch((error) => {
        console.error('Erro ao atualizar os dados:', error);
        Alert.alert('Erro', 'Não foi possível atualizar os dados. Tente novamente mais tarde.');
      });
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: background }]}>
      <ImageBackground
        source={require('../../../../assets/frutas_fundo.png')}
        style={styles.imageBackground}
        imageStyle={{ opacity: 0.5 }}
      >
        <View style={[styles.container, { backgroundColor: cardBackground }]}>
          <Text style={[styles.title, { color: textColor }]}>Dados Pessoais</Text>
          <Text style={[styles.subtitle, { color: colorScheme === 'dark' ? '#8E8E93' : '#6C757D' }]}>
            Atualize suas informações pessoais
          </Text>

          <CustomField 
            title='Nome Completo' 
            placeholder="Seu nome completo" 
            value={nome} 
            setValue={setNome} 
          />
          
          <CustomField 
            title='Idade' 
            placeholder="Sua idade em anos" 
            value={idade} 
            setValue={setIdade}
            keyboardType="numeric"
          />

          <View style={styles.centered}>
            <CustomPicker
              label="Objetivo"
              selectedValue={objetivo}
              onValueChange={(value) => setObjetivo(value)}
              options={[
                { label: "Emagrecimento", value: "Emagrecimento" },
                { label: "Musculo", value: "Musculo" },
                { label: "Saúde", value: "Saúde" }
              ]}
            />
          </View>

          <View style={styles.centered}>
            <CustomButton title='Salvar Dados' modeButton={true} onPress={AtualizarDados} size="large" style={{width: '100%'}} />
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
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 20,
    textAlign: 'center',
  },
  centered: {
    alignItems: 'center',
    marginVertical: 12,
    width: '100%',
  },
});
