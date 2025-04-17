import { useEffect, useState } from 'react';
import { StatusBar, View, ActivityIndicator, Text } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import AppTabs from './src/routes/appRoute.js';
import RoutePag from './src/routes/authRoute.js';
import { auth } from './src/database/firebase.js';

// IMPORTS para fontes
import { useFonts, K2D_400Regular } from '@expo-google-fonts/k2d';

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [userState, setUserState] = useState(null);

  // Carregando a fonte K2D
  const [fontsLoaded] = useFonts({
    'K2D-Regular': K2D_400Regular,
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserState(user);
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, []);

  // Esperando fonte ou autenticação
  if (initializing || !fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
        <StatusBar hidden={false} />
        <Text>Carregando...</Text>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar hidden={false} />
      {userState ? <AppTabs /> : <RoutePag />}
    </NavigationContainer>
  );
}
