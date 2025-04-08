import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CustomModal } from "../pages/modal/Pagamento.js";
import Settings from '../pages/main/Config.js';
import Wellcome from '../pages/welcome/index.js';  //Index representa a pasta
import LoginPag from '../pages/login/Login.js';
import CreateUser from "../pages/login/Registro.js";
import React from "react";
import AppTabs from "./appRoute.js";

export default function RoutePag() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen name="Bem_Vindo" component={Wellcome} options={{ headerShown: false }} />
      <Stack.Screen name="appTab" component={AppTabs} options={{headerShown: false}}/>
      <Stack.Screen
        name="Login"
        component={LoginPag}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='Registro'
        component={CreateUser}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Config" component={Settings}/>
    </Stack.Navigator>
  )
}