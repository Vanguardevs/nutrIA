import React, { useEffect, useState } from "react";
import { View, SafeAreaView, Text, useColorScheme, Alert, Platform } from "react-native";
import CustomButton from "../../../components/shared/CustomButton";
import CustomField from "../../../components/shared/CustomField";
import { auth } from "../../../database/firebase";
import { multiFactor, PhoneMultiFactorGenerator, RecaptchaVerifier } from "firebase/auth";

export default function SecurityAccount() {
  const [phone, setPhone] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [verificationId, setVerificationId] = useState<string>("");

  const colorScheme = useColorScheme();
  const background = colorScheme === "dark" ? "#1C1C1E" : "#F2F2F2";
  const texts = colorScheme === "dark" ? "#F2F2F2" : "#1C1C1E";

  useEffect(() => {
    const phoneData = auth.currentUser?.phoneNumber;
    if (phoneData) setPhone(phoneData);
  }, []);

  async function enviarCodigo() {
    if (!phone || phone.length < 10) {
      Alert.alert("Erro", "Número de telefone inválido");
      return;
    }
    try {
      const verifier = new RecaptchaVerifier(
        Platform.OS === "web" ? ("recaptcha-container" as any) : (undefined as any),
        Platform.OS === "web" ? ({ size: "invisible" } as any) : ({} as any),
        auth as any,
      );
      // @ts-ignore signInWithPhoneNumber available in compat; in modular, use signInWithPhoneNumber from firebase/auth
      const verification = await (auth as any).signInWithPhoneNumber(phone, verifier);
      setVerificationId(verification.verificationId);
      Alert.alert("Sucesso", "Código de verificação enviado!");
    } catch (error) {
      console.error("Erro ao enviar o código: ", error);
      Alert.alert("Erro", "Erro ao enviar o código de verificação.");
    }
  }

  async function verificarCodigo() {
    if (!code) {
      Alert.alert("Erro", "Código inválido");
      return;
    }
    try {
      const user = auth.currentUser!;
      const multiFactorUser = multiFactor(user);
      const credential = (PhoneMultiFactorGenerator as any).credential(verificationId, code);
      await multiFactorUser.enroll(credential, "Verificação de telefone");
      Alert.alert("Sucesso", "Código verificado com sucesso!");
    } catch (error) {
      console.log("Erro ao verificar o código: ", error);
      Alert.alert("Erro", "Erro ao verificar o código");
    }
  }

  return (
    <SafeAreaView style={{ backgroundColor: background, flex: 1 }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: texts }}>Configurações de Segurança</Text>
        <CustomField
          title="Numero de telefone"
          placeholder="Seu telefone"
          value={phone}
          setValue={setPhone}
          keyboardType="phone-pad"
        />
        <CustomButton title="Enviar Código" modeButton={true} onPress={enviarCodigo} />
        <CustomField
          title="Código de verificação"
          placeholder="Código de verificação"
          value={code}
          setValue={setCode}
          keyboardType="numeric"
        />
        <CustomButton title="Verificar Código" modeButton={true} onPress={verificarCodigo} />
        {Platform.OS === "web" && <View nativeID="recaptcha-container" style={{ width: 0, height: 0 }} />}
      </View>
    </SafeAreaView>
  );
}
