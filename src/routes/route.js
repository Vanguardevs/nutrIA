import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../pages/main/Home.js'
import Settings from '../pages/main/Config.js';
import Header from "../pages/cabecalho/header.js";
import Wellcome from '../pages/welcome';  //Index representa a pasta
import LoginPag from '../pages/login/Login.js';
import CreateUser from "../pages/login/Registro.js";
import Progress from "../pages/main/Progress.js";
import Diary from "../pages/main/Diary.js";
import { Button } from "react-native";


const Tab = createBottomTabNavigator();

function TesteTabs() {
  return (
    <Tab.Navigator options={{Header}}>
      <Tab.Screen name="Agendas" component={Diary} options={{header:(props)=><Header {...props}/>, title: "Agendas"}}/>
      <Tab.Screen name="Nutria" component={Home} options={{header: (props)=><Header {...props} />, title:"Nutria"}}/>
      <Tab.Screen name="Progresso" component={Progress} options={{header:(props)=><Header {...props} />, title: "Progresso"}}/>
    </Tab.Navigator>
  )
}


export default function TesteStack() {
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
    </Stack.Navigator>
  )
}