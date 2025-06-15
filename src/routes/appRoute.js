import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {useColorScheme} from "react-native";

//Páginas de navegação do aplicativo já logado
import Progress from "../pages/main//Progress/Progress.js";
import CreateDiary from '../pages/main/Diary/CreateDiary.js';
import EditDiary from '../pages/main/Diary/EditDiary.js';
import Diary from "../pages/main/Diary/Diary.js";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from "../pages/cabecalho/header.js";
import Home from '../pages/main/Home.js';
import AccountUser from '../pages/main/Config/Account.js';
import DataUser from '../pages/main/Config/DataUser.js';
import HealthData from '../pages/main/Config/HealthData.js';
import Settings from '../pages/main/Config/Config.js';
import ResumoDiario from '../pages/main/Progress/ResumoDiario.js';
import EditHealth from '../pages/main/Config/EditHealth.js';




const TabArr = [
    {"route":'Nutria', "label": Home, "icon_active": 'leaf-outline', "icon": 'leaf', 'color_basic': 'gray', "color_hover": "green"},
    {"route":'Agendas', "label": Diary, "icon_active": 'calendar-outline', "icon": 'calendar', 'color_basic': 'gray', "color_hover": "green"},
    {"route":'Progresso', "label": Progress, "icon_active": 'analytics-outline', "icon": 'analytics', 'color_basic': 'gray', "color_hover": "green"},
];

const StackItems =[
    {"route":"Config", "label": Settings, "headerTitle": "Configurações"},
    {"route":"Create-Diary", "label": CreateDiary, "headerTitle": "Criar Agenda"},
    {"route":"Edit-Diary", "label": EditDiary, "headerTitle": "Editar Agenda"},
    {"route":"HealthData", "label": HealthData, "headerTitle": "Dados de Saúde"},
    {"route":"AccountUser", "label": AccountUser, "headerTitle": "Conta"},
    {"route":"DataUser", "label": DataUser, "headerTitle": "Dados Pessoais"},
    {"route":"ResumoDiario", "label": ResumoDiario, "headerTitle": "Resumo Diário"},
    {"route":"EditHealth", "label": EditHealth, "headerTitle": "Editar Condições médicas"},
]


export default function AppTabs() {

    const colorScheme = useColorScheme();

    const tabBarBackgroundColor = colorScheme === 'dark'
        ? '#1C1C1E'
        : '#F2F2F2';

    const textColor = colorScheme === 'dark'
        ? '#F2F2F2'
        : '#1C1C1E';
    
    const Tab = createBottomTabNavigator();
    const Stack = createNativeStackNavigator();

    function TabNavigator() {
        return (
            <Tab.Navigator
                tabBarPosotion="bottom"
                initialRouteName="Nutria"
                screenOptions={{
                    tabBarStyle: {
                        swipeEnabled: false,
                        display: 'flex',
                        position: 'absolute',
                        bottom: '2%',
                        right: '0.5%',
                        left: '0.5%',
                        height:'8%',
                        elevation: 3,
                        backgroundColor: tabBarBackgroundColor,
                        borderRadius: 15,
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 2,
                            height: 3,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.5,
                        borderTopWidth: 0,
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
                            keyboardHidesTabBar: item.route === 'Nutria',
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

            {StackItems.map((item,index)=>(
                <Stack.Screen
                    key={index}
                    name={item.route}
                    component={item.label}
                    options={{
                            headerTitle: item.headerTitle, 
                            headerStyle:{backgroundColor: tabBarBackgroundColor}, 
                            headerTintColor: textColor, 
                            headerTitleStyle:{fontWeight: 'bold', fontSize: 24}
                        }}
                />
            ))}

        </Stack.Navigator>
    );
}