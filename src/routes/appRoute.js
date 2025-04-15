import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Progress from "../pages/main/Progress.js";
import CreateDiary from '../pages/main/Diary/CreateDiary.js';
import EditDiary from '../pages/main/Diary/EditDiary.js';
import Diary from "../pages/main/Diary/Diary.js";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from "../pages/cabecalho/header.js";
import Home from '../pages/main/Home.js';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Settings from '../pages/main/Config.js';

const TabArr = [
    {"route":'Nutria', "label": Home, "icon_active": 'leaf-outline', "icon": 'leaf'},
    {"route":'Agendas', "label": Diary, "icon_active": 'calendar-outline', "icon": 'calendar'},
    {"route":'Progresso', "label": Progress, "icon_active": 'analytics-outline', "icon": 'analytics'},
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
                        bottom: '5%',
                        top: '0.5%',
                        right: '0.5%',
                        left: '0.5%',
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
                                    color={color}
                                />
                            ),
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
            <Stack.Screen name="Config" component={Settings} />
            <Stack.Screen name="Create-Diary" component={CreateDiary} options={{headerShown: false}}/>
            <Stack.Screen name="Edit-Diary" component={EditDiary} options={{headerShown: false}}/>
        </Stack.Navigator>
    );
}