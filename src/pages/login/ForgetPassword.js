import React, { useState } from 'react';
import { SafeAreaView, View, useColorScheme, ImageBackground, StyleSheet, Text } from 'react-native';
import CustomButton from '../../components/CustomButton.js';
import CustomField from '../../components/shared/CustomField.js';
import CustomModal from '../../components/CustomModal.js';
import { auth } from '../../database/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

export default function ForgetPassword() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  const background = colorScheme === 'dark' ? "#1C1C1E" : "#F2F2F2";
  const texts = colorScheme === 'dark' ? "#F2F2F2" : "#1C1C1E";
  const cardBackground = colorScheme === 'dark' ? "#2C2C2E" : "#FFFFFF";

  const [email, setEmail] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    type: 'info'
  });

  const showModal = (title, message, type = 'info') => {
    setModalConfig({ title, message, type });
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
    navigation.goBack();
  };

  async function resetPassword() {
    if (email.length === 0) {
      showModal("Campo Vazio", "Por favor, digite seu email para redefinir a senha.", "warning");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      showModal(
        "Email Enviado! 📧", 
        `Um email de redefinição de senha foi enviado para:\n\n${email}\n\n📋 Verifique sua caixa de entrada (e pasta de spam) e siga as instruções no email para criar uma nova senha.\n\n⏰ O link de redefinição expira em 1 hora.`, 
        "success"
      );
      console.log("Email de redefinição de senha enviado!");
      
      // Limpar o campo de email após envio bem-sucedido
      setEmail('');
      
    } catch (error) {
      console.error("Erro ao enviar email de redefinição de senha:", error);
      
      if (error.code === "auth/user-not-found") {
        showModal(
          "Email Não Encontrado", 
          "Não existe uma conta cadastrada com este email. Verifique o endereço e tente novamente.", 
          "error"
        );
      } else if (error.code === "auth/invalid-email") {
        showModal(
          "Email Inválido", 
          "O formato do email não é válido. Digite um email válido no formato exemplo@email.com", 
          "error"
        );
      } else if (error.code === "auth/too-many-requests") {
        showModal(
          "Muitas Tentativas", 
          "Muitas tentativas de redefinição de senha. Aguarde alguns minutos antes de tentar novamente.", 
          "warning"
        );
      } else {
        showModal(
          "Erro no Envio", 
          "Não foi possível enviar o email de redefinição de senha. Verifique sua conexão e tente novamente.", 
          "error"
        );
      }
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
          <Text style={[styles.subtitle, { color: colorScheme === 'dark' ? '#8E8E93' : '#6C757D' }]}>
            Digite seu email para receber um link de redefinição de senha.
          </Text>
          <CustomField
            title="Email"
            placeholder="Digite seu email"
            value={email}
            setValue={setEmail}
            keyboardType="email-address"
            autoComplete="email"
            textContentType="emailAddress"
            autoCapitalize="none"
          />
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Enviar Email"
              onPress={resetPassword}
              modeButton={true}
              style={styles.button}
            />
          </View>
        </View>
      </ImageBackground>

      <CustomModal
        visible={modalVisible}
        onClose={hideModal}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        confirmText="OK"
      />
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
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
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

