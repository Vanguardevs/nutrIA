import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Progress from '../pages/main/Progress.js';
import Home from '../pages/main/Home.js';
import Diary from '../pages/main/Diary/Diary.js';
import Settings from '../pages/main/Config/Config.js';
import ResumoDiario from '../pages/main/ResumoDiario.js';
import ResumoSemanal from '../pages/main/ResumoSemanal.js';

const TabArr = [
  {
    route: 'Nutria',
    label: Home,
    icon_active: 'leaf-outline',
    icon: 'leaf',
    color_basic: 'gray',
    color_hover: 'green',
  },
  {
    route: 'Agendas',
    label: Diary,
    icon_active: 'calendar-outline',
    icon: 'calendar',
    color_basic: 'gray',
    color_hover: 'green',
  },
  {
    route: 'Progresso',
    label: Progress,
    icon_active: 'analytics-outline',
    icon: 'analytics',
    color_basic: 'gray',
    color_hover: 'green',
  },
];

const StackItems = [
  { route: 'Config', label: Settings, headerTitle: 'Configurações' },
  { route: 'ResumoDiario', label: ResumoDiario, headerTitle: 'Resumo Diário' },
  { route: 'ResumoSemanal', label: ResumoSemanal, headerTitle: 'Resumo Semanal' }, // ✅ Novo item
];

export default function AppTabs() {
  const colorScheme = useColorScheme();

  const tabBarBackgroundColor = colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F2';
  const textColor = colorScheme === 'dark' ? '#F2F2F2' : '#1C1C1E';

  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator();

  function TabNavigator() {
    return (
      <Tab.Navigator
        initialRouteName="Nutria"
        screenOptions={{
          tabBarStyle: {
            position: 'absolute',
            bottom: '2%',
            right: '0.5%',
            left: '0.5%',
            height: '8%',
            backgroundColor: tabBarBackgroundColor,
            borderRadius: 15,
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
              title: item.route,
              tabBarIcon: ({ focused }) => (
                <Ionicons
                  name={focused ? item.icon_active : item.icon}
                  size={22}
                  color={focused ? item.color_hover : item.color_basic}
                />
              ),
              tabBarActiveTintColor: 'green',
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
      {StackItems.map((item, index) => (
        <Stack.Screen
          key={index}
          name={item.route}
          component={item.label}
          options={{
            headerTitle: item.headerTitle,
            headerStyle: { backgroundColor: tabBarBackgroundColor },
            headerTintColor: textColor,
            headerTitleStyle: { fontWeight: 'bold', fontSize: 24 },
          }}
        />
      ))}
    </Stack.Navigator>
  );
}
