import React, { useState } from 'react';
import { SafeAreaView, View, useColorScheme, ImageBackground, StyleSheet, Alert, Text } from 'react-native';
import CustomButton from '../../components/CustomButton';
import CustomField from '../../components/CustomField';
import { auth } from '../../database/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function ForgetPassword() {
  const colorScheme = useColorScheme();

  const background = colorScheme === 'dark' ? "#1C1C1E" : "#F2F2F2";
  const texts = colorScheme === 'dark' ? "#F2F2F2" : "#1C1C1E";
  const cardBackground = colorScheme === 'dark' ? "#2C2C2E" : "#FFFFFF";

  const [email, setEmail] = useState('');

  async function resetPassword() {
    if (email.length === 0) {
      Alert.alert("Erro", "O campo de email está vazio");
      console.log("O campo de email está vazio");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Sucesso", "Email de redefinição de senha enviado!");
      console.log("Email de redefinição de senha enviado!");
    }
    catch (e) {
      console.error("Erro ao enviar email de redefinição de senha:", e);
      Alert.alert("Erro", "Não foi possível enviar o email de redefinição de senha. Verifique seu email e tente novamente.");
    }
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: background }]}>
      <ImageBackground
        source={require('../../../assets/Frutas_home.png')}
        style={styles.backgroundImage}
      >
        <View style={[styles.card, { backgroundColor: cardBackground }]}>
          <Text style={[styles.title, { color: texts }]}>Redefinir Senha</Text>
          <CustomField
            title="Email"
            placeholder="Digite seu email"
            value={email}
            setValue={setEmail}
            keyboardType="email-address"
          />
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Enviar"
              onPress={resetPassword}
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
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  button: {
    width: '60%',
  },
});