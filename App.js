import React, { useEffect, useState } from 'react';
import { StatusBar, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { auth } from './src/database/firebase'; // Ajuste seu caminho
import * as Notifications from 'expo-notifications';

import { useFonts, K2D_400Regular } from '@expo-google-fonts/k2d';

import AppTabs from './src/routes/appRoute';
import RoutePag from './src/routes/authRoute';

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [userState, setUserState] = useState(null);

  const [fontsLoaded] = useFonts({
    'K2D-Regular': K2D_400Regular,
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUserState(user);
      if (initializing) setInitializing(false);
    });

    async function verificarNotificacao() {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted') {
        console.log('Permissão de notificação concedida');
      }
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'nutria',
          importance: Notifications.AndroidImportance.LOW,
        });
      }
    }

    verificarNotificacao();

    return unsubscribe;
  }, []);

  if (initializing || !fontsLoaded) {
    return null; 
  }

  return (
    <NavigationContainer>
      <StatusBar hidden={false} />
      {userState ? <AppTabs /> : <RoutePag />}
    </NavigationContainer>
  );
}