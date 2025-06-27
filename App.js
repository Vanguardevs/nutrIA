import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { auth } from './src/database/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import AppTabs from './src/routes/appRoute.js';
import AuthTabs from './src/routes/authRoute.js';
import AnimatedSplash from './src/components/AnimatedSplash.js';
import * as Notifications from 'expo-notifications';

// Configuração global de notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Configurar listener de notificações
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('[APP] Notificação recebida:', notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('[APP] Resposta da notificação:', response);
    });

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setIsLoading(false);

      // Se o usuário está logado e email verificado, mover dados de pendingUsers para users
      if (user && user.emailVerified) {
        try {
          const { getDatabase, ref, get, set, remove } = await import('firebase/database');
          const db = getDatabase();
          const userId = user.uid;
          const pendingRef = ref(db, `pendingUsers/${userId}`);
          const userRef = ref(db, `users/${userId}`);
          const snap = await get(pendingRef);
          if (snap.exists()) {
            const data = snap.val();
            await set(userRef, data);
            await remove(pendingRef);
            console.log('[APP] Dados migrados de pendingUsers para users com sucesso!');
          }
        } catch (e) {
          console.log('[APP] Erro ao migrar dados de pendingUsers para users:', e);
        }
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
      unsubscribe();
    };
  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <AnimatedSplash onAnimationFinish={handleSplashFinish} />;
  }

  if (isLoading) {
    return null;
  }

  // Permitir acesso apenas se o email estiver verificado
  if (user && user.emailVerified) {
    return (
      <NavigationContainer>
        <StatusBar style="dark" backgroundColor="#FFFFFF" />
        <AppTabs />
      </NavigationContainer>
    );
  } else if (user && !user.emailVerified) {
    // Se o usuário não for verificado, faz logout e mostra AuthTabs
    signOut(auth);
    return (
      <NavigationContainer>
        <StatusBar style="dark" backgroundColor="#FFFFFF" />
        <AuthTabs />
      </NavigationContainer>
    );
  } else {
    return (
      <NavigationContainer>
        <StatusBar style="dark" backgroundColor="#FFFFFF" />
        <AuthTabs />
      </NavigationContainer>
    );
  }
}