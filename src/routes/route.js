import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../components/Main/Home.js'
import Settings from '../components/Main/Config.js';
import Wellcome from '../components/wellcome/Wellcome.js';
import LoginPag from '../components/login/login.js';
import createUser from "../components/login/cadastro.js";

function TesteTabs(){
  const Tab = createBottomTabNavigator();
  return(
    <Tab.Navigator>
      <Tab.Screen name="Main" component={Home}/>
      <Tab.Screen name="Config" component={Settings}/>
    </Tab.Navigator>
  )
}


export default function TesteStack(){
const Stack = createNativeStackNavigator();

  return(
  <Stack.Navigator>
    <Stack.Screen name="Bem_Vindo" component={Wellcome} options={{headerShown: false}}/>
    <Stack.Screen name="appTab" component={TesteTabs}/>
        <Stack.Screen
        name="Login"
        component={LoginPag}
        options={{headerShown: false}}
        />
        <Stack.Screen
        name='Cadastro'
        component={createUser}
        options={{headerShown: false}}
        />
  </Stack.Navigator>
  )
}