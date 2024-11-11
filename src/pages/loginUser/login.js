import { View, Text, Button, TextInput, StyleSheet } from "react-native-web"

export default function LoginPag(){
    return(
        <View style={styles.container}>
        <Text>Nome:</Text>
        <TextInput style={styles.input} placeholder='Insira seu nome:'></TextInput>
        <Text>Email:</Text>
        <TextInput style={styles.input} placeholder='Insira seu email:'></TextInput>
        <Button title=''></Button>
      </View>
    )
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
  