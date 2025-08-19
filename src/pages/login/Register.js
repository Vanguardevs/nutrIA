import { Text, TouchableOpacity, StyleSheet, View, SafeAreaView, Alert, useColorScheme, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import CustomField from "../../components/shared/CustomField";
import CustomButton from "../../components/CustomButton";
import CustomPicker from "../../components/shared/CustomPicker";
import styles from "../../theme/styles";
import RNPickerSelect from 'react-native-picker-select';

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

      if(idade < 12){
        Alert.alert("Idade Inválida", "O Aplicativo não aceita menores de 12 anos")
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
    <SafeAreaView style={[styles.registerContainer, {backgroundColor: background}]}>

           <ImageBackground
            source={require('../../../assets/Frutas_home.png')}
            style={styles.registerBackground}>

      <View style={styles.registerCenter}>
        <CustomField title="Nome" value={nome} setValue={setNome} keyboardType="text" placeholder="Insira seu nome:" />
        <CustomField title="Email" value={email} setValue={setEmail} keyboardType="email-address" placeholder="Insira seu email:" />
        <CustomField title="Senha" value={password} setValue={setPassword} keyboardType="text" placeholder="Insira sua senha:" secureTextEntry />

         <View style={styles.registerRow}> 
          <CustomField title="Idade" value={idade} setValue={setIdade} placeholder="0" keyboardType="numeric" style={styles.registerIdade} />

          <CustomPicker
            label="Sexo"
            selectedValue={sexo}
            onValueChange={(value)=> setSexo(value)}
            options={[
              { label: "Masculino", value: "masculino" },
              { label: "Feminino", value: "feminino" },
              { label: "Outro", value: "outro" }
            ]}
          />
          
        </View>
      </View>

      <View style={styles.registerBottom}>
        <CustomButton title="Próximo" onPress={nextPage} modeButton={true} />
      </View>
      </ImageBackground>
    </SafeAreaView>
    
  );
}




const customPickerStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'blue',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});