import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { NavigationContainer} from "@react-navigation/native";
import RoutePag from './src/routes/route.js'

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar/>
      <RoutePag/>
    </NavigationContainer>
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
