import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Wellcome from '../pages/wellcome/welcome.js';
import LoginPag from "../pages/loginUser/login.js";
import createUser from "../pages/loginUser/register.js";
import Home from "../pages/Main/Home.js";
import Settings from "../pages/Main/Config.js";

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function appTab(){
    return(
    <Tabs.Navigator
    initialRouteName="Home"
    screenOptions={{headerShown: false}}
    >
        <Tabs.Screen
            name="Home"
            component={Home}
            options={{title: 'Chat', tabBarIcon:({size,color})=>(
                <MaterialCommunityIcons name="Home" size={size} color={color}/>
            )
        }}
        />
        <Tabs.Screen
            name="Settings"
            component={Settings}
        />
    </Tabs.Navigator>
    )
}

export default function RoutePag(){
    return(
    <Stack.Navigator>
        <Stack.Screen
        name="Bem_Vindo"
        component={Wellcome}
        options={{headerShown: false}}
        />
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
        <Stack.Screen
        name="appTab"
        component={appTab}
        />
    </Stack.Navigator>
    )
}