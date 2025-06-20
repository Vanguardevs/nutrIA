import React, { useEffect, useState } from 'react';
import CustomButton from '../../../components/CustomButton';
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
  const [altura, setAltura] = useState('');
  const [peso, setPeso] = useState('');
  const [idade, setIdade] = useState('');
  const [objetivo, setObjetivo] = useState('');

  useEffect(() => {
    const db = getDatabase();
    const userID = auth.currentUser.uid;
    const userRef = ref(db, 'users/' + userID);

    onValue(userRef, (resp) => {
      const data = resp.val();
      if (data) {
        setNome(data.nome);
        setAltura(data.altura);
        setPeso(data.peso);
        setIdade(data.idade);
        setObjetivo(data.objetivo);
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
      objetivo.length === 0 ||
      peso.length === 0 ||
      altura.length === 0
    ) {
      Alert.alert("Tente novamente", "Alguns dos campos de cadastro estão vazios");
      console.log("Campos vazios");
      return;
    }

    update(userRef, {
      nome: nome,
      altura: altura,
      peso: peso,
      idade: idade,
      objetivo: objetivo
    })
      .then(() => {
        console.log('Dados atualizados com sucesso!');
        Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
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
          <Text style={[styles.title, { color: textColor }]}>Atualizar Dados</Text>

          <CustomField title='Nome atual' placeholder="Seu nome atual" value={nome} setValue={setNome} />
          <CustomField title='Idade atual' placeholder="Sua idade atual" value={idade} setValue={setIdade} />

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

          <CustomField title='Peso atual' placeholder="Seu peso atual" value={peso} setValue={setPeso} />
          <CustomField title='Altura atual' placeholder="Sua altura atual" value={altura} setValue={setAltura} />

          <View style={styles.centered}>
            <CustomButton title='Salvar dado' modeButton={true} onPress={AtualizarDados} />
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
  centered: {
    alignItems: 'center',
    marginVertical: 12,
    width: '100%',
  },
});
