import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { auth } from "src/database/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import AppTabs from "src/routes/appRoute";
import AuthTabs from "src/routes/authRoute";
import AnimatedSplash from "src/components/AnimatedSplash";
import ErrorBoundary from "src/components/ErrorBoundary";
import * as Notifications from "expo-notifications";
import * as firebaseDatabase from "firebase/database";

// Configuração global de notificações (apenas em native)
if (Platform.OS !== "web") {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  // On web, don't block initial render while waiting for Firebase; show AuthTabs quickly
  const [isLoading, setIsLoading] = useState(Platform.OS !== "web");
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Configurar listener de notificações (apenas native)
    let notificationListener: Notifications.Subscription | undefined;
    let responseListener: Notifications.Subscription | undefined;
    if (Platform.OS !== "web") {
      notificationListener = Notifications.addNotificationReceivedListener((notification) => {
        console.log("[APP] Notificação recebida:", notification);
      });
      responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("[APP] Resposta da notificação:", response);
      });
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setIsLoading(false);

      // Se o usuário está logado e email verificado, mover dados de pendingUsers para users
      if (user && user.emailVerified) {
        try {
          const db = firebaseDatabase.getDatabase();
          const userId = user.uid;
          const pendingRef = firebaseDatabase.ref(db, `pendingUsers/${userId}`);
          const userRef = firebaseDatabase.ref(db, `users/${userId}`);
          const snap = await firebaseDatabase.get(pendingRef);
          if (snap.exists()) {
            const data = snap.val();
            await firebaseDatabase.set(userRef, data);
            await firebaseDatabase.remove(pendingRef);
            console.log("[APP] Dados migrados de pendingUsers para users com sucesso!");
          }
        } catch (e) {
          console.log("[APP] Erro ao migrar dados de pendingUsers para users:", e);
        }
      }
    });

    return () => {
      if (Platform.OS !== "web") {
        if (notificationListener) Notifications.removeNotificationSubscription(notificationListener);
        if (responseListener) Notifications.removeNotificationSubscription(responseListener);
      }
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
      <ErrorBoundary>
        <NavigationContainer>
          <StatusBar style="dark" backgroundColor="#FFFFFF" />
          <AppTabs />
        </NavigationContainer>
      </ErrorBoundary>
    );
  } else if (user && !user.emailVerified) {
    // Se o usuário não for verificado, faz logout e mostra AuthTabs
    signOut(auth);
    return (
      <ErrorBoundary>
        <NavigationContainer>
          <StatusBar style="dark" backgroundColor="#FFFFFF" />
          <AuthTabs />
        </NavigationContainer>
      </ErrorBoundary>
    );
  } else {
    return (
      <ErrorBoundary>
        <NavigationContainer>
          <StatusBar style="dark" backgroundColor="#FFFFFF" />
          <AuthTabs />
        </NavigationContainer>
      </ErrorBoundary>
    );
  }
}
