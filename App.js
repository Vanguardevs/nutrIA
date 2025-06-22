import { useEffect, useState, useCallback } from 'react';
import { StatusBar, View, ActivityIndicator, Text, Alert, Platform } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppTabs from './src/routes/appRoute.js';
import RoutePag from './src/routes/authRoute.js';
import { auth } from './src/database/firebase.js';
import * as Notifications from 'expo-notifications';
import AnimatedSplash from './src/components/AnimatedSplash';
import { clearAllCaches } from './src/utils/apiCache.js';
import { clearAllCache } from './src/utils/foodsLoader.js';

// IMPORTS para fontes
import { useFonts, K2D_400Regular } from '@expo-google-fonts/k2d';
import axios from 'axios';

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [userState, setUserState] = useState(null);
  const [showSplash, setShowSplash] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Carregando a fonte K2D
  const [fontsLoaded] = useFonts({
    'K2D-Regular': K2D_400Regular,
  });

  const handleSplashFinish = useCallback(() => {
    // Só esconde o splash se os dados já foram carregados
    if (!isLoadingData) {
      setShowSplash(false);
    }
  }, [isLoadingData]);

  const manterLoggado = useCallback(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserState(user);
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, [initializing]);

  const verificarNotificacao = useCallback(async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      
      if (status === 'granted') {
        console.log("Permissão de notificação concedida");
      } else {
        console.log("Permissão de notificação não concedida");
      }
      
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'nutria',
          importance: Notifications.AndroidImportance.LOW,
        });
      }
    } catch (error) {
      console.warn('Erro ao verificar notificações:', error);
    }
  }, []);

  const ligarRender = useCallback(async () => {
    try {
      // Usa um timeout para não bloquear o carregamento inicial
      setTimeout(async () => {
        try {
          await axios.get("https://nutria-6uny.onrender.com/on");
        } catch (error) {
          console.warn('Erro ao ligar servidor:', error);
        }
      }, 1000);
    } catch (error) {
      console.warn('Erro ao ligar render:', error);
    }
  }, []);

  const limparCachesAutomaticamente = useCallback(async () => {
    try {
      // Verifica se é necessário limpar caches (executa apenas uma vez por dia)
      const lastCleanup = await AsyncStorage.getItem('last_cache_cleanup');
      const today = new Date().toDateString();
      
      if (lastCleanup !== today) {
        console.log('Executando limpeza automática de caches...');
        
        // Limpa caches expirados
        await Promise.allSettled([
          clearAllCaches(),
          clearAllCache()
        ]);
        
        // Marca que a limpeza foi feita hoje
        await AsyncStorage.setItem('last_cache_cleanup', today);
        console.log('Limpeza automática de caches concluída');
      }
    } catch (error) {
      console.warn('Erro na limpeza automática de caches:', error);
    }
  }, []);

  const carregarDadosIniciais = useCallback(async () => {
    try {
      console.log('Iniciando carregamento de dados iniciais...');
      
      // Executa as operações em paralelo
      await Promise.allSettled([
        verificarNotificacao(),
        ligarRender(),
        limparCachesAutomaticamente()
      ]);
      
      console.log('Carregamento de dados iniciais concluído');
    } catch (error) {
      console.warn('Erro no carregamento de dados iniciais:', error);
    } finally {
      setIsLoadingData(false);
      
      // Se o splash já terminou, esconde ele
      if (!showSplash) {
        setShowSplash(false);
      }
    }
  }, [verificarNotificacao, ligarRender, limparCachesAutomaticamente, showSplash]);

  useEffect(() => {
    // Inicia autenticação imediatamente
    manterLoggado();
    
    // Carrega dados em background
    carregarDadosIniciais();
  }, [manterLoggado, carregarDadosIniciais]);

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