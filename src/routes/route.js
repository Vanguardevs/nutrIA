import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../pages/main/Home.js';
import { CustomModal } from "../pages/modal/Pagamento.js";
import Settings from '../pages/main/Config.js';
import Header from "../pages/cabecalho/header.js";
import Wellcome from '../pages/welcome';  //Index representa a pasta
import LoginPag from '../pages/login/Login.js';
import CreateUser from "../pages/login/Registro.js";
import Progress from "../pages/main/Progress.js";
import Diary from "../pages/main/Diary.js";
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from "react";


const Tab = createBottomTabNavigator();

function TesteTabs() {
  return (
    <Tab.Navigator
    //Essa confiuração é para o tabBar, onde está definindo os icons da aba de navegação
    screenOptions={({route}) =>({
      tabBarIcon: ({focused, color, size}) => {
        let iconName;

        if(route.name === 'Agendas') {
          iconName = focused ? 'calendar' : 'calendar-outline';
        }
        if(route.name === 'Nutria') {
          iconName = focused ? 'leaf' : 'leaf-outline';
        }
        if(route.name === 'Progresso') {
          iconName = focused ? 'analytics' : 'analytics-outline';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      }

    })}
    >

      <Tab.Screen name="Nutria" component={Home} options={{header: (props)=><Header {...props} />, title:"Nutria"}}/>
      <Tab.Screen name="Agendas" component={Diary} options={{header:(props)=><Header {...props}/>, title: "Agendas"}}/>
      <Tab.Screen name="Progresso" component={Progress} options={{header:(props)=><Header {...props} />, title: "Progresso"}}/>
    </Tab.Navigator>
  )
}


export default function RoutePag() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen name="Bem_Vindo" component={Wellcome} options={{ headerShown: false }} />
      <Stack.Screen name="appTab" component={TesteTabs} options={{headerShown: false}}/>
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