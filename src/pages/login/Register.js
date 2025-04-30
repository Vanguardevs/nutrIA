import { Text, TouchableOpacity, StyleSheet, View, SafeAreaView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import CustomField from "../../components/CustomField";
import CustomButton from "../../components/CustomButton";
import CustomPicker from "../../components/CustomPicker";

export default function CreateUser() {

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [idade, setIdade] = useState(0);
  const [sexo, setSexo] = useState('');
  const navigation = useNavigation();

  async function nextPage() {
    try{
      if(nome.length === 0 || password.length === 0 || email.length === 0 || idade.length === 0 || sexo.length === 0){
        Alert.alert("Tente novamente", "Alguns dos campos de cadastro estão vazios")
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
    <SafeAreaView style={styles.container}>

      <View style={styles.centerContainer}>
        <CustomField title="Nome" value={nome} setValue={setNome} keyboardType="text" placeholder="Insira seu nome:" />
        <CustomField title="Email" value={email} setValue={setEmail} keyboardType="email-address" placeholder="Insira seu email:" />
        <CustomField title="Senha" value={password} setValue={setPassword} keyboardType="text" placeholder="Insira sua senha:" secureTextEntry />

        <View style={styles.rowContainer}>
          <CustomField title="Idade" value={idade} setValue={setIdade} keyboardType="numeric" placeholder="Insira sua idade:" style={styles.miniField} />

          <CustomPicker
            label="Sexo"
            setValue={sexo}
            onValueChange={setSexo}
            options={[
              { label: "Selecione...", value: "" },
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
  miniField: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    width: '75%',
    overflow: 'hidden',
  },
});