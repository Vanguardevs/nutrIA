import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../pages/main/Home.js'
import Settings from '../pages/main/Config.js';
import Wellcome from '../pages/welcome';  //Index representa a pasta
import LoginPag from '../pages/login/Login.js';
import createUser from "../pages/login/Registro.js";

const Tab = createBottomTabNavigator();

function TesteTabs() {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen name="Main" component={Home} options={{headerShown: false}}/>
      <Tab.Screen name="Config" component={Settings} />
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
        component={createUser}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  )
}