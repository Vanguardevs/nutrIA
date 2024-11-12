import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Wellcome from '../pages/wellcome/welcome.js';
import LoginPag from "../pages/loginUser/login.js";
import createUser from "../pages/registerUser/register.js";
import Home from '../pages/Main/Home.js';


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
        name="Home"
        component={Home}
        options={{headerShown: false}}
        />
    </Stack.Navigator>
    )
}