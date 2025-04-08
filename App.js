import { StatusBar } from 'react-native';
// import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import RoutePag from './src/routes/route.js';


export default function App() {
  return (
    <NavigationContainer>
      <StatusBar hidden={false}/>
      <RoutePag />
    </NavigationContainer>
  );
}
