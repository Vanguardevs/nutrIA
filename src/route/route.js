import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Wellcome from '../pages/wellcome/welcome.js';
import LoginPag from "../pages/loginUser/login.js";
import createUser from "../pages/loginUser/register.js";
import appTab from "./tabsLogin.js";

const Stack = createNativeStackNavigator();

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