import { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import AppTabs from './src/routes/appRoute.js';
import RoutePag from './src/routes/authRoute.js';
import {auth} from './src/database/firebase.js';
import { View, ActivityIndicator, Text } from 'react-native';


export default function App() {

  const [initializing, setInitializing] = useState(true);
  const [userState, setUserState] = useState(null);

  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserState(user);
      if (initializing) setInitializing(false);
    });

    return unsubscribe;

  },[])

  if (initializing){
    return(
      <View style={{flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center'}}>
        <StatusBar hidden={false}/>
        <Text>Carregando...</Text>
        <ActivityIndicator size="large" color="#0000ff"/>
      </View>
    )
  }

  return (
    <NavigationContainer>
      <StatusBar hidden={false}/>
      {userState ? <AppTabs/>: <RoutePag/>}
    </NavigationContainer>
  );
}
