import {  TouchableOpacity, View, Text, Button, TextInput, StyleSheet, Modal } from "react-native";
import Theme from "../theme/theme";
import React, { useState, useEffect } from "react";
import styles from "../theme/styles";
import { LinearGradient } from 'expo-linear-gradient';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  style: StyleSheet;
  modeButton: boolean;
}

const CustomButton = ({ title, onPress, modeButton }: CustomButtonProps) => {
  const [mode, setMode] = useState(false);

  useEffect(() => {
    setMode(modeButton);
  }, [modeButton]);

  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[
        styless.button,
        mode
          ? styless.activeButton
          : styless.inactiveButton,
      ]}
    >
      <LinearGradient
        colors={mode ? ['#2E8331', '#2F9933'] : ['#b71c1c', '#ff4e50']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styless.gradient}
      >
        <Text
          style={[
            styless.ButtonText,
            mode ? styless.activeButtonText : styless.inactiveButtonText
          ]}
        >
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styless = StyleSheet.create({
  button: {
    borderRadius: Theme.borderRadius,
    height: 50,
    width: 200, 
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Theme.borderRadius,
    width: '100%',
  },
  activeButton: {
    borderWidth: 2,
    borderColor: '#2F9933',
  },
  inactiveButton: {
    borderWidth: 2,
    borderColor: '#ccc',
  },
  ButtonText: {
    fontFamily: Theme.font.fontFamily,
    fontSize: 16,
    textAlign: 'center',
  },
  activeButtonText: {
    color: 'white',
  },
  inactiveButtonText: {
    color: '#black',
  },
});

export default CustomButton;