import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Progress from "../pages/main/Progress.js";
import CreateDiary from '../pages/main/Diary/CreateDiary.js';
import EditDiary from '../pages/main/Diary/EditDiary.js';
import Diary from "../pages/main/Diary/Diary.js";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from "../pages/cabecalho/header.js";
import Home from '../pages/main/Home.js';
import AccountUser from '../pages/main/Config/Account.js';
import DataUser from '../pages/main/Config/DataUser.js';
import SecurityAccount from '../pages/main/Config/SecurityAccount.js';
import Settings from '../pages/main/Config/Config.js';

const TabArr = [
    {"route":'Nutria', "label": Home, "icon_active": 'leaf-outline', "icon": 'leaf', 'color_basic': 'gray', "color_hover": "green"},
    {"route":'Agendas', "label": Diary, "icon_active": 'calendar-outline', "icon": 'calendar', 'color_basic': 'gray', "color_hover": "green"},
    {"route":'Progresso', "label": Progress, "icon_active": 'analytics-outline', "icon": 'analytics', 'color_basic': 'gray', "color_hover": "green"},
];



export default function AppTabs() {
    
    const Tab = createBottomTabNavigator();
    const Stack = createNativeStackNavigator();

    function TabNavigator() {
        return (
            <Tab.Navigator
                screenOptions={{
                    tabBarStyle: {
                        position: 'relative',
                        top: '0.3%',
                        right: '0.5%',
                        left: '0.5%',
                        height:'8%',
                        marginBottom: '2%',
                        elevation: 3,
                        backgroundColor: '#f5f5f5',
                        borderRadius: 15,
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 2,
                            height: 3,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.5,
                    },
                }}
            >
                {TabArr.map((item, index) => (
                    <Tab.Screen
                        key={index}
                        name={item.route}
                        component={item.label}
                        options={{
                            header: (props) => <Header {...props} />,
                            title: item.route,
                            tabBarIcon: ({ color, focused }) => (
                                <Ionicons
                                    name={focused ? item.icon_active : item.icon}
                                    size={22}
                                    color={focused ? item.color_hover : item.color_basic}
                                />
                            ),
                            tabBarActiveTintColor: 'green'
                        }}
                    />
                ))}
            </Tab.Navigator>
        );
    }

    return (
        <Stack.Navigator>

            <Stack.Screen
                name="MainTabs"
                component={TabNavigator}
                options={{ headerShown: false }}
            />

            <Stack.Screen 
                name="Config" 
                component={Settings} 
                options={{headerTitle: 'Configurações', headerTitleStyle:{fontWeight: 'bold', fontSize: 24}}}
            />

            <Stack.Screen 
                name="Create-Diary" 
                component={CreateDiary} 
                options={{headerTitle: 'Criar agenda', headerTitleStyle:{fontWeight: 'bold',fontSize: 24}}
            }/>

            <Stack.Screen 
                name="Edit-Diary" 
                component={EditDiary} 
                options={{headerTitle: 'Editar Agenda', headerTitleStyle:{fontWeight: 'bold', fontSize: 24}}}
            />

            <Stack.Screen
                name="SecurityAccount"
                component={SecurityAccount}
                options={{headerTitle: 'Segurança da sua conta', headerTitleStyle:{fontWeight: 'bold', fontSize: 24}}}
            />
            
            <Stack.Screen
                name="AccountUser"
                component={AccountUser}
                options={{headerTitle: 'Dados de sua Conta', headerTitleStyle:{fontWeight: 'bold', fontSize: 24}}}
            />

            <Stack.Screen
                name="DataUser"
                component={DataUser}
                options={{headerTitle: 'Dados Pessoais', headerTitleStyle:{fontWeight: 'bold', fontSize: 24}}}
            />

        </Stack.Navigator>
    );
}