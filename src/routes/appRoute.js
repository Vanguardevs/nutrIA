import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme, Platform, StatusBar, Keyboard, View, Text } from "react-native";
import React, { useState, useEffect } from 'react';
import { Animated, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

//Páginas de navegação do aplicativo já logado
import Progress from "../pages/main//Progress/Progress.js";
import CreateDiary from '../pages/main/Diary/CreateDiary.js';
import EditDiary from '../pages/main/Diary/EditDiary.js';
import Diary from "../pages/main/Diary/Diary.js";
import Header from "../pages/cabecalho/header.js";
import Home from '../pages/main/Home.js';
import AccountUser from '../pages/main/Config/Account.js';
import DataUser from '../pages/main/Config/DataUser.js';
import HealthData from '../pages/main/Config/HealthData.js';
import Settings from '../pages/main/Config/Config.js';
import ResumoDiario from '../pages/main/Progress/ResumoDiario.js';
import EditHealth from '../pages/main/Config/EditHealth.js';
import Map from '../pages/main/Map/Map.js';
import HeaderMapButton from '../components/HeaderMapButton.tsx';

// Componente de header com gradiente verde
const GradientHeader = ({ title, navigation }) => {
    return (
        <LinearGradient
            colors={['#1B5E20', '#2E8331']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientHeader}
        >
            <View style={styles.headerContent}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{title}</Text>
                <View style={styles.placeholder} />
            </View>
        </LinearGradient>
    );
};

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
export const AnimatedHeaderButton = ({ onPress, navigation }) => {
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

// Componente de botão de lixeira animado
export const AnimatedTrashButton = ({ onPress }) => {
    const scaleValue = React.useRef(new Animated.Value(1)).current;
    const shakeValue = React.useRef(new Animated.Value(0)).current;

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

        // Animação de shake
        Animated.sequence([
            Animated.timing(shakeValue, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(shakeValue, {
                toValue: -1,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(shakeValue, {
                toValue: 0,
                duration: 100,
                useNativeDriver: true,
            })
        ]).start();

        onPress();
    };

    const shake = shakeValue.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: ['-5deg', '0deg', '5deg'],
    });

    return (
        <TouchableOpacity onPress={handlePress}>
            <Animated.View
                style={[
                    {
                        marginRight: 8,
                        marginLeft: 4,
                        marginBottom: 8,
                        backgroundColor: '#FF3B30',
                        borderRadius: 20,
                        width: 40,
                        height: 40,
                        justifyContent: 'center',
                        alignItems: 'center',
                        shadowColor: '#FF3B30',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.12,
                        shadowRadius: 2,
                        elevation: 1,
                    },
                    {
                        transform: [{ scale: scaleValue }, { rotate: shake }]
                    }
                ]}
            >
                <Ionicons name="trash-outline" size={24} color="#FFF" />
            </Animated.View>
        </TouchableOpacity>
    );
};

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
                            position: 'relative',
                            bottom: 0,
                            right: 0,
                            left: 0,
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
                            marginHorizontal: '0.5%',
                            marginBottom: '2%',
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
                            tabBarLabel: item.route === 'Diary' ? 'Diário' : item.route === 'Progress' ? 'Progresso' : item.title,
                            headerStyle: {
                                height: Platform.OS === 'ios' ? 120 : 90,
                                backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#FFFFFF',
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
                                color: textColor,
                            },
                            tabBarShowLabel: !keyboardVisible,
                            tabBarActiveTintColor: 'green',
                            headerTitleStyle: {
                                fontWeight: 'bold',
                                color: colorScheme === 'dark' ? '#FFFFFF' : '#2E8331',
                                fontSize: 28,
                                alignSelf: 'center',
                                textAlign: 'center',
                                width: '100%',
                                marginTop: Platform.OS === 'ios' ? 20 : 0,
                            },
                            headerRight: () => (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {/* Botão de lixeira - apenas na tela Home */}
                                    {item.route === 'Nutria' && (
                                        <AnimatedTrashButton
                                            onPress={() => {
                                                // Usa uma referência global para acessar a função clearMessages
                                                if (global.clearMessagesFunction) {
                                                    global.clearMessagesFunction();
                                                }
                                            }}
                                        />
                                    )}
                                    
                                    {/* Botão de mapa - apenas na tela Home */}
                                    {item.route === 'Nutria' && (
                                        <HeaderMapButton
                                            onPress={() => navigation.navigate('Map')}
                                        />
                                    )}
                                    
                                    {/* Botão de configurações */}
                                    <AnimatedHeaderButton
                                        onPress={() => navigation.navigate('Config')}
                                        navigation={navigation}
                                    />
                                </View>
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

            <Stack.Screen
                name="Map"
                component={Map}
                options={{
                    header: ({ navigation }) => <GradientHeader title="Mapa" navigation={navigation} />,
                }}
            />

            <Stack.Screen
                name="Config"
                component={Settings}
                options={({ navigation }) => ({
                    headerShown: true,
                    header: () => <GradientHeader title="Configurações" navigation={navigation} />,
                })}
            />

            <Stack.Screen
                name="AccountUser"
                component={AccountUser}
                options={{
                    headerShown: true,
                    headerTitle: "Conta do Usuário",
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
                name="DataUser"
                component={DataUser}
                options={{
                    headerShown: true,
                    headerTitle: "Dados do Usuário",
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
                name="HealthData"
                component={HealthData}
                options={({ navigation }) => ({
                    headerShown: true,
                    header: () => <GradientHeader title="Dados de Saúde" navigation={navigation} />,
                })}
            />

            <Stack.Screen
                name="EditHealth"
                component={EditHealth}
                options={{
                    headerShown: true,
                    headerTitle: "Editar Dados de Saúde",
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
                name="CreateDiary"
                component={CreateDiary}
                options={({ navigation }) => ({
                    headerShown: true,
                    header: () => <GradientHeader title="Criar Agenda Alimentar" navigation={navigation} />,
                })}
            />

            <Stack.Screen
                name="EditDiary"
                component={EditDiary}
                options={({ navigation }) => ({
                    headerShown: true,
                    header: () => <GradientHeader title="Editar Agenda Alimentar" navigation={navigation} />,
                })}
            />

            <Stack.Screen
                name="ResumoDiario"
                component={ResumoDiario}
                options={({ navigation }) => ({
                    headerShown: true,
                    header: () => <GradientHeader title="Resumo do Progresso" navigation={navigation} />,
                })}
            />
        </Stack.Navigator>
    );
}

const TabArr = [
    {
        route: 'Nutria',
        label: Home,
        title: 'NutrIA',
        icon: 'leaf-outline',
        icon_active: 'leaf',
        color_basic: 'gray',
        color_hover: 'green',
    },
    {
        route: 'Diary',
        label: Diary,
        title: 'Diário',
        icon: 'calendar-outline',
        icon_active: 'calendar',
        color_basic: 'gray',
        color_hover: 'green',
    },
    {
        route: 'Progress',
        label: Progress,
        title: 'Progresso',
        icon: 'bar-chart-outline',
        icon_active: 'bar-chart',
        color_basic: 'gray',
        color_hover: 'green',
    },
];

const styles = StyleSheet.create({
    gradientHeader: {
        height: Platform.OS === 'ios' ? 120 : 90,
        paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 16,
        height: 56,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        flex: 1,
    },
    placeholder: {
        width: 40,
    },
});