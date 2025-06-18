import { useEffect, useState } from 'react';
import { StatusBar, View, ActivityIndicator, Text, Alert, Platform } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppTabs from './src/routes/appRoute.js';
import RoutePag from './src/routes/authRoute.js';
import { auth } from './src/database/firebase.js';
import * as Notifications from 'expo-notifications';
import AnimatedSplash from './src/components/AnimatedSplash';

// IMPORTS para fontes
import { useFonts, K2D_400Regular } from '@expo-google-fonts/k2d';
import axios from 'axios';

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [userState, setUserState] = useState(null);
  const [showSplash, setShowSplash] = useState(true);

  // Carregando a fonte K2D
  const [fontsLoaded] = useFonts({
    'K2D-Regular': K2D_400Regular,
  });

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  function manterLoggado(){
  const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserState(user);
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }

  async function verificarNotificação(){

    const {status} = await Notifications.requestPermissionsAsync();
    
    if (status === 'granted') {
      console.log("Permissão de notificação concedida");
    } else {
      console.log("Permissão de notificação não concedida");
    }
    
    if(Platform.OS === 'android'){
      Notifications.setNotificationChannelAsync('default',{
        name: 'nutria',
        importance: Notifications.AndroidImportance.LOW,
      });
  }
}

  async function ligarRender(){
    const resp = await axios.get("https://nutria-6uny.onrender.com/on")
    return resp.data;
  }

  useEffect(() => {
    ligarRender();
    manterLoggado()
    verificarNotificação()
  }, []);


  // Esperando fonte ou autenticação
  if (initializing || !fontsLoaded) {
    return (
      <NavigationContainer>
        
        <StatusBar hidden={false}/>
        <RoutePag/>

      </NavigationContainer>
    );
  }

  if (showSplash) {
    return <AnimatedSplash onAnimationFinish={handleSplashFinish} />;
  }

  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#f8f8f8" barStyle="dark-content"/>
      {userState ? <AppTabs/> : <RoutePag/>}
    </NavigationContainer>
  );
}