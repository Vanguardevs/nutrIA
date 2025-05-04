import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useColorScheme } from "react-native";

//Páginas do aplicativo para fazer loggin
import HealthRegister from "../pages/login/HealthRegister.js";
import Wellcome from '../pages/welcome/index.js';
import LoginPag from '../pages/login/Login.js';
import Restricoes from "../pages/login/Restrições.js";
import CreateUser from "../pages/login/Register.js";
import React from "react";
import AppTabs from "./appRoute.js";


export default function RoutePag() {
  const Stack = createNativeStackNavigator();

  const colorScheme = useColorScheme();

  const background = colorScheme === 'dark'? "#1C1C1E" : "#F2F2F2";
  const texts = colorScheme === 'dark'? "#F2F2F2" : "#1C1C1E";

  const StackItems = [
    {"name":"Bem_Vindo", "component": Wellcome, "options": {headerShown: false}},
    {"name":"Login", "component": LoginPag, "options": {headerShown: false}},
    {"name":"Registro", "component": CreateUser, "options": {headerTitleAlign: 'center', headerTitle: 'Cadastro', headerStyle:{backgroundColor: background}, headerTintColor: texts}},
    {"name":"HealthRegister", "component": HealthRegister, "options":{headerTitleAlign: 'center', headerTitle: 'Cadastro de Saúde', headerStyle:{backgroundColor: background}, headerTintColor: texts}},
    {"name":"Restricoes", "component": Restricoes, "options": {headerTitleAlign: 'center', headerTitle: 'Cadastro de Saúde', headerStyle:{backgroundColor: background}, headerTintColor: texts}}
  ]

  return (
    <Stack.Navigator>

      {StackItems.map((item, index)=>(
        <Stack.Screen
          key={index}
          name={item.name}
          component={item.component}
          options={item.options}
        />
      ))}

    </Stack.Navigator>
  )
}