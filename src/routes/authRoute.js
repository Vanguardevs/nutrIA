import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme, Platform, StatusBar } from "react-native";

//Páginas de navegação do aplicativo não logado
import Login from '../pages/login/Login.js';
import Register from '../pages/login/registers/Register.js';
import ForgetPassword from '../pages/login/ForgetPassword.js';
import HealthRegister from '../pages/login/registers/HealthRegister.js';
import Restrições from '../pages/login/registers/Restrições.js';

export default function AuthTabs() {
    const colorScheme = useColorScheme();
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator
            screenOptions={{
                // Animações de transição para o Stack Navigator
                animation: 'slide_from_right',
                animationDuration: 300,
                gestureEnabled: true,
                gestureDirection: 'horizontal',
                cardStyleInterpolator: ({ current, layouts }) => {
                    return {
                        cardStyle: {
                            transform: [
                                {
                                    translateX: current.progress.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [layouts.screen.width, 0],
                                    }),
                                },
                            ],
                            opacity: current.progress.interpolate({
                                inputRange: [0, 0.5, 1],
                                outputRange: [0, 0.5, 1],
                            }),
                        },
                    };
                },
            }}
        >
            <Stack.Screen
                name="Login"
                component={Login}
                options={{
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="Register"
                component={Register}
                options={{
                    headerShown: true,
                    headerTitle: "Cadastro",
                    headerTitleStyle: {
                        fontWeight: 'bold',
                        color: colorScheme === 'dark' ? '#FFFFFF' : '#2E8331',
                        fontSize: 20,
                    },
                    headerStyle: {
                        backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#FFFFFF',
                        elevation: 0,
                        shadowOpacity: 0,
                    },
                    headerTintColor: colorScheme === 'dark' ? '#FFFFFF' : '#2E8331',
                }}
            />

            <Stack.Screen
                name="ForgetPassword"
                component={ForgetPassword}
                options={{
                    headerShown: true,
                    headerTitle: "Esqueci a Senha",
                    headerTitleStyle: {
                        fontWeight: 'bold',
                        color: colorScheme === 'dark' ? '#FFFFFF' : '#2E8331',
                        fontSize: 20,
                    },
                    headerStyle: {
                        backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#FFFFFF',
                        elevation: 0,
                        shadowOpacity: 0,
                    },
                    headerTintColor: colorScheme === 'dark' ? '#FFFFFF' : '#2E8331',
                }}
            />

            <Stack.Screen
                name="HealthRegister"
                component={HealthRegister}
                options={{
                    headerShown: true,
                    headerTitle: "Dados de Saúde",
                    headerTitleStyle: {
                        fontWeight: 'bold',
                        color: colorScheme === 'dark' ? '#FFFFFF' : '#2E8331',
                        fontSize: 20,
                    },
                    headerStyle: {
                        backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#FFFFFF',
                        elevation: 0,
                        shadowOpacity: 0,
                    },
                    headerTintColor: colorScheme === 'dark' ? '#FFFFFF' : '#2E8331',
                }}
            />

            <Stack.Screen
                name="Restrições"
                component={Restrições}
                options={{
                    headerShown: true,
                    headerTitle: "Restrições Alimentares",
                    headerTitleStyle: {
                        fontWeight: 'bold',
                        color: colorScheme === 'dark' ? '#FFFFFF' : '#2E8331',
                        fontSize: 20,
                    },
                    headerStyle: {
                        backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#FFFFFF',
                        elevation: 0,
                        shadowOpacity: 0,
                    },
                    headerTintColor: colorScheme === 'dark' ? '#FFFFFF' : '#2E8331',
                }}
            />
        </Stack.Navigator>
    );
}