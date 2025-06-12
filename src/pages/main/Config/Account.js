import React, { useState, useEffect } from 'react';
import CustomField from '../../../components/CustomField';
import CustomButton from '../../../components/CustomButton';
import { View, SafeAreaView, Text, StyleSheet, useColorScheme, Alert, ImageBackground } from 'react-native';
import { getDatabase, onValue, ref, update } from 'firebase/database';
import { auth } from '../../../database/firebase';
import { sendPasswordResetEmail, updateEmail } from 'firebase/auth';

export default function AccountUser() {
  const [email, setEmail] = useState('');

  const colorScheme = useColorScheme();
  const background = colorScheme === 'dark' ? "#1C1C1E" : "#F2F2F2";
  const textColor = colorScheme === 'dark' ? "#F2F2F2" : "#1C1C1E";
  const cardColor = colorScheme === 'dark' ? "rgba(44,44,46,0.85)" : "rgba(255,255,255,0.85)";

  useEffect(() => {
    function getData() {
      const db = getDatabase();
      const userID = auth.currentUser.uid;
      const userRef = ref(db, 'users/' + userID);

      onValue(userRef, (resp) => {
        const data = resp.val();
        if (data) {
          setEmail(data.email);
        }
      });
    }
    getData();
  }, []);

  function RedefinePassword() {
    if (email === '') {
      Alert.alert('Por favor, insira um email válido.');
      return;
    }

    sendPasswordResetEmail(auth, auth.currentUser.email)
      .then(() => {
        Alert.alert('Email de redefinição de senha enviado com sucesso!');
      })
      .catch((error) => {
        console.error('Erro ao enviar email de redefinição de senha:', error);
        Alert.alert('Erro ao enviar email. Tente novamente mais tarde.');
      });
  }

  function updateEmailAddress() {
    if (email === '') {
      Alert.alert('Por favor, insira um email válido.');
      return;
    }

    const db = getDatabase();
    const userID = auth.currentUser.uid;
    const userRef = ref(db, 'users/' + userID);

    update(userRef, { email: email })
      .then(() => {
        updateEmail(auth.currentUser, email)
          .then(() => {
            Alert.alert('Email atualizado com sucesso!');
          })
          .catch((error) => {
            console.error('Erro ao atualizar email:', error);
            Alert.alert('Erro ao atualizar email. Tente novamente mais tarde.');
          });
      });
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: background }]}>
      <ImageBackground
        source={require('../../../../assets/frutas_fundo.png')}
        style={styles.imageBackground}
        imageStyle={{ opacity: 1 }}
      >
        <View style={[styles.container, { backgroundColor: cardColor }]}>
          <Text style={[styles.title, { color: textColor }]}>Minha Conta</Text>

          <CustomField
            title="Email atual"
            placeholder="Seu email"
            value={email}
            setValue={setEmail}
          />

          <View style={styles.buttonsContainer}>
            <CustomButton
              title="Redefinir senha"
              onPress={RedefinePassword}
              modeButton={false}
              style={styles.button}
            />

            <CustomButton
              title="Salvar alterações"
              onPress={updateEmailAddress}
              modeButton={true}
              style={styles.button}
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
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonsContainer: {
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
  },
  button: {
    width: '80%',
    marginVertical: 6,
  },
});
