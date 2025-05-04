import { Text, TouchableOpacity, StyleSheet, View, SafeAreaView, Alert, useColorScheme } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import CustomField from "../../components/CustomField";
import CustomButton from "../../components/CustomButton";
import CustomPicker from "../../components/CustomPicker";

export default function CreateUser() {

  const colorScheme = useColorScheme();

  const background = colorScheme === 'dark'? "#1C1C1E" : "#F2F2F2";
  const texts = colorScheme === 'dark'? "#F2F2F2" : "#1C1C1E";

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [idade, setIdade] = useState(null);
  const [sexo, setSexo] = useState('');
  const navigation = useNavigation();

  async function nextPage() {
    try{
      if(nome.length === 0 || password.length === 0 || email.length === 0 || idade.length === 0 || sexo.length === 0){
        Alert.alert("Tente novamente", "Alguns dos campos de cadastro estão vazios")
        return;
      }

      if(password.length < 8){
        Alert.alert("Tente novamente", "A senha deve ter no mínimo 8 caracteres")
        console.log("Senha inválida")
        return;
      }

      navigation.navigate("HealthRegister", {
        nome: nome,
        email: email,
        password: password,
        idade: idade,
        sexo: sexo
      });
    }catch(error){
      console.log("Error")
    }
  }

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: background}]}>

      <View style={styles.centerContainer}>
        <CustomField title="Nome" value={nome} setValue={setNome} keyboardType="text" placeholder="Insira seu nome:" />
        <CustomField title="Email" value={email} setValue={setEmail} keyboardType="email-address" placeholder="Insira seu email:" />
        <CustomField title="Senha" value={password} setValue={setPassword} keyboardType="text" placeholder="Insira sua senha:" secureTextEntry />

        <View style={styles.rowContainer}>
          <CustomField title="Idade" value={idade} setValue={setIdade} placeholder="0" keyboardType="numeric" style={styles.ageField} />

          <CustomPicker
            label="Sexo"
            selectedValue={sexo}
            onValueChange={(value)=> setSexo(value)}
            options={[
              { label: "Masculino", value: "masculino" },
              { label: "Feminino", value: "feminino" },
              { label: "Outro", value: "outro" }
            ]}
            style={{ width: '75%', overflow: 'hidden' }}
          />
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <CustomButton title="Próximo" onPress={nextPage} modeButton={true} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  bottomContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 16,
  },
  ageField: {
      height: 45,
      width: '100%',
      borderColor: "#2E8331",
      borderWidth: 2, 
      borderRadius: 10, 
      paddingHorizontal: 10,
      marginRight: 'auto',
      marginLeft: 'auto',
      fontSize: 16,
      backgroundColor: "#fff",
      color: "#333",
      shadowColor: "#000", 
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
  },
});