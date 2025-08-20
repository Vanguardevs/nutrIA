// @ts-nocheck
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useColorScheme, Platform, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

// Páginas de navegação do aplicativo não logado
import Welcome from "../pages/welcome";
import Login from "../pages/login/Login";
import Register from "../pages/login/registers/Register";
import ForgetPassword from "../pages/login/ForgetPassword";
import HealthRegister from "../pages/login/registers/HealthRegister";
import Restrições from "../pages/login/registers/Restrições";

const GradientHeader: React.FC<{ title: string; showBack: boolean; navigation: any }> = ({
  title,
  showBack,
  navigation,
}) => (
  <LinearGradient
    colors={["#1B5E20", "#2E8331"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={{ height: 90, justifyContent: "flex-end", paddingBottom: 8 }}
  >
    <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16 }}>
      {showBack ? (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ width: 40, height: 40, justifyContent: "center", alignItems: "center" }}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 40 }} />
      )}
      <Text style={{ flex: 1, color: "#FFF", fontWeight: "bold", fontSize: 22, textAlign: "center" }}>
        {title}
      </Text>
      <View style={{ width: 40 }} />
    </View>
  </LinearGradient>
);

export default function AuthTabs(): JSX.Element {
  const colorScheme = useColorScheme();
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        animation: "slide_from_right",
        gestureEnabled: true,
      }}
    >
      <Stack.Screen
        name="Welcome"
        component={Welcome}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Login"
        component={Login}
        options={({ navigation }) => ({
          headerShown: true,
          header: () => <GradientHeader title="Login" showBack={false} navigation={navigation} />,
        })}
      />

      <Stack.Screen
        name="Register"
        component={Register}
        options={({ navigation }) => ({
          headerShown: true,
          header: () => <GradientHeader title="Cadastro" showBack={true} navigation={navigation} />,
        })}
      />

      <Stack.Screen
        name="ForgetPassword"
        component={ForgetPassword}
        options={({ navigation }) => ({
          headerShown: true,
          header: () => <GradientHeader title="Redefinir Senha" showBack={true} navigation={navigation} />,
        })}
      />

      <Stack.Screen
        name="HealthRegister"
        component={HealthRegister}
        options={({ navigation }) => ({
          headerShown: true,
          header: () => <GradientHeader title="Dados de Saúde" showBack={true} navigation={navigation} />,
        })}
      />

      <Stack.Screen
        name="Restrições"
        component={Restrições}
        options={({ navigation }) => ({
          headerShown: true,
          header: () => (
            <GradientHeader title="Restrições Alimentares" showBack={true} navigation={navigation} />
          ),
        })}
      />
    </Stack.Navigator>
  );
}
