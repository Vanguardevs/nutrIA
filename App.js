import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { auth } from './src/database/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import AppTabs from './src/routes/appRoute.js';
import AuthTabs from './src/routes/authRoute.js';
import AnimatedSplash from './src/components/AnimatedSplash.js';

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    return unsubscribe;
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

  return (
    <NavigationContainer>
      <StatusBar style="dark" backgroundColor="#FFFFFF" />
      {user ? <AppTabs /> : <AuthTabs />}
    </NavigationContainer>
  );
}