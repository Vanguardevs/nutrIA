import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme, Platform, StatusBar, Keyboard } from "react-native";
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

//Páginas de navegação do aplicativo já logado
import Progress from "../pages/main//Progress/Progress.js";
import CreateDiary from '../pages/main/Diary/CreateDiary.js';
import EditDiary from '../pages/main/Diary/EditDiary.js';
import Diary from "../pages/main/Diary/Diary.js";
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import Header from "../pages/cabecalho/header.js";
import Home from '../pages/main/Home.js';
import AccountUser from '../pages/main/Config/Account.js';
import DataUser from '../pages/main/Config/DataUser.js';
import HealthData from '../pages/main/Config/HealthData.js';
import Settings from '../pages/main/Config/Config.js';
import ResumoDiario from '../pages/main/Progress/ResumoDiario.js';
import EditHealth from '../pages/main/Config/EditHealth.js';

// Componente de ícone animado para a tab bar
const AnimatedTabIcon = ({ focused, iconActive, icon, colorBasic, colorHover, iconSize, keyboardVisible }) => {
    const scaleValue = React.useRef(new Animated.Value(1)).current;
    const opacityValue = React.useRef(new Animated.Value(0.8)).current;

    React.useEffect(() => {
        const scaleAnimation = Animated.timing(scaleValue, {
            toValue: focused ? 1.2 : 1,
            duration: 200,
            useNativeDriver: true,
        });

        const opacityAnimation = Animated.timing(opacityValue, {
            toValue: focused ? 1 : 0.7,
            duration: 200,
            useNativeDriver: true,
        });

        Animated.parallel([scaleAnimation, opacityAnimation]).start();
    }, [focused]);

    return (
        <Animated.View 
            style={{ 
                marginTop: keyboardVisible ? 4 : 0,
                marginBottom: keyboardVisible ? 4 : 0,
                transform: [{ scale: scaleValue }],
                opacity: opacityValue,
            }}
        >
            <Ionicons
                name={focused ? iconActive : icon}
                size={iconSize}
                color={focused ? colorHover : colorBasic} 
            />
        </Animated.View>
    );
};

// Componente de botão animado para o header
const AnimatedHeaderButton = ({ onPress, navigation }) => {
    const scaleValue = React.useRef(new Animated.Value(1)).current;
    const rotateValue = React.useRef(new Animated.Value(0)).current;

    const handlePress = () => {
        // Animação de pressionar
        Animated.sequence([
            Animated.timing(scaleValue, {
                toValue: 0.9,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleValue, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            })
        ]).start();

        // Animação de rotação sutil
        Animated.timing(rotateValue, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            rotateValue.setValue(0);
        });

        onPress();
    };

    const rotate = rotateValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    return (
        <TouchableOpacity onPress={handlePress}>
            <Animated.View
                style={[
                    {
                        marginRight: 12,
                        marginLeft: 4,
                        marginBottom: 8,
                        backgroundColor: '#2E8331',
                        borderRadius: 20,
                        width: 40,
                        height: 40,
                        justifyContent: 'center',
                        alignItems: 'center',
                        shadowColor: '#2E8331',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.12,
                        shadowRadius: 2,
                        elevation: 1,
                    },
                    {
                        transform: [{ scale: scaleValue }, { rotate }]
                    }
                ]}
            >
                <Ionicons name="options" size={24} color="#FFF" />
            </Animated.View>
        </TouchableOpacity>
    );
};

const TabArr = [
    {"route":'Nutria', "label": Home, "icon_active": 'leaf-outline', "icon": 'leaf', 'color_basic': 'gray', "color_hover": "green", "title": "Nutria"},
    {"route":'Agendas', "label": Diary, "icon_active": 'calendar-outline', "icon": 'calendar', 'color_basic': 'gray', "color_hover": "green", "title": "Agendas"},
    {"route":'Progresso', "label": Progress, "icon_active": 'analytics-outline', "icon": 'analytics', 'color_basic': 'gray', "color_hover": "green", "title": "Progresso"},
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
        const [keyboardVisible, setKeyboardVisible] = useState(false);
        const [tabBarHeight, setTabBarHeight] = useState('8%');
        const [iconSize, setIconSize] = useState(22);

        // Animação da tab bar quando o teclado aparece/desaparece
        const tabBarOpacity = React.useRef(new Animated.Value(1)).current;
        const tabBarTranslateY = React.useRef(new Animated.Value(0)).current;

        useEffect(() => {
            const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
                setKeyboardVisible(true);
                setTabBarHeight('6%');
                setIconSize(18);

                // Animação suave da tab bar quando o teclado aparece
                Animated.parallel([
                    Animated.timing(tabBarOpacity, {
                        toValue: 0.9,
                        duration: 250,
                        useNativeDriver: true,
                    }),
                    Animated.timing(tabBarTranslateY, {
                        toValue: -5,
                        duration: 250,
                        useNativeDriver: true,
                    })
                ]).start();
            });

            const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
                setKeyboardVisible(false);
                setTabBarHeight('8%');
                setIconSize(22);

                // Animação suave da tab bar quando o teclado desaparece
                Animated.parallel([
                    Animated.timing(tabBarOpacity, {
                        toValue: 1,
                        duration: 250,
                        useNativeDriver: true,
                    }),
                    Animated.timing(tabBarTranslateY, {
                        toValue: 0,
                        duration: 250,
                        useNativeDriver: true,
                    })
                ]).start();
            });

            return () => {
                keyboardDidShowListener?.remove();
                keyboardDidHideListener?.remove();
            };
        }, []);

        return (
            <Tab.Navigator
                tabBarPosition="bottom"
                initialRouteName="Nutria"
                screenOptions={{
                    // Animações de transição entre telas
                    animationEnabled: true,
                    animationTypeForReplace: 'push',
                    tabBarStyle: [
                        {
                            swipeEnabled: false,
                            display: 'flex',
                            position: 'absolute',
                            bottom: '2%',
                            right: '0.5%',
                            left: '0.5%',
                            height: tabBarHeight,
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
                        {
                            opacity: tabBarOpacity,
                            transform: [{ translateY: tabBarTranslateY }]
                        }
                    ],
                }}
            >
                {TabArr.map((item, index) => (
                    <Tab.Screen
                        key={index}
                        name={item.route}
                        component={item.label}
                        options={({ navigation }) => ({
                            headerShown: true,
                            headerTitle: item.title,
                            headerStyle: {
                                height: Platform.OS === 'ios' ? 90 : 60,
                                justifyContent: 'center',
                                alignItems: 'center',
                            },
                            headerStatusBarHeight: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight,
                            keyboardHidesTabBar: item.route === 'Nutria',
                            tabBarIcon: ({ color, focused }) => (
                                <AnimatedTabIcon
                                    focused={focused}
                                    iconActive={item.icon_active}
                                    icon={item.icon}
                                    colorBasic={item.color_basic}
                                    colorHover={item.color_hover}
                                    iconSize={iconSize}
                                    keyboardVisible={keyboardVisible}
                                />
                            ),
                            tabBarLabelStyle: {
                                fontSize: keyboardVisible ? 0 : 12,
                                marginTop: keyboardVisible ? -8 : 0,
                                opacity: keyboardVisible ? 0 : 1,
                            },
                            tabBarShowLabel: !keyboardVisible,
                            tabBarActiveTintColor: 'green',
                            headerTitleStyle: {
                                fontWeight: 'bold',
                                color: 'green',
                                fontSize: 28,
                                alignSelf: 'center',
                                textAlign: 'center',
                                width: '100%',
                                marginTop: Platform.OS === 'ios' ? 20 : 0,
                            },
                            headerRight: () => (
                                <AnimatedHeaderButton
                                    onPress={() => navigation.navigate('Config')}
                                    navigation={navigation}
                                />
                            ),
                        })}
                    />
                ))}
            </Tab.Navigator>
        );
    }

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
                        headerTitleStyle:{fontWeight: 'bold', fontSize: 24},
                        // Animação específica para telas de configuração
                        animation: item.route === 'Config' ? 'slide_from_bottom' : 'slide_from_right',
                        presentation: item.route === 'Config' ? 'modal' : 'card',
                    }}
                />
            ))}
        </Stack.Navigator>
    );
}