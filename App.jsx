import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Nome:</Text>
      <TextInput style={styles.input} placeholder='Insira seu nome:'></TextInput>
      <Text>Email:</Text>
      <TextInput style={styles.input} placeholder='Insira seu email:'></TextInput>
      <Button title=''></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input:{
    backgroundColor: 'gray',
  }
});
