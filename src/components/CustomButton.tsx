import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../theme/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator } from "react-native";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  style?: any;
  modeButton?: boolean;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
}

const CustomButton = (props: CustomButtonProps) => {
  const { borderRadius, font, colors } = useTheme();
  const [mode, setMode] = useState(false);

  useEffect(() => {
    setMode(props.modeButton || false);
  }, [props.modeButton]);

  const getButtonStyle = () => {
    const baseStyle = [styles.button, { borderRadius: borderRadius.lg }];
    
    // Size variants
    switch (props.size) {
      case 'small':
        baseStyle.push(styles.buttonSmall);
        break;
      case 'large':
        baseStyle.push(styles.buttonLarge);
        break;
      default:
        baseStyle.push(styles.buttonMedium);
    }

    // Custom style override
    if (props.style) {
      baseStyle.push(props.style);
    }

    return baseStyle;
  };

  const getGradientColors = () => {
    if (props.variant === 'danger') {
      return ['#FF3B30', '#FF453A'];
    }
    if (props.variant === 'secondary') {
      return ['#8E8E93', '#AEAEB2'];
    }
    return mode ? ['#2E8331', '#2F9933'] : ['#2E8331', '#2F9933'];
  };

  return (
    <TouchableOpacity
      onPress={props.isLoading ? undefined : props.onPress}
      style={getButtonStyle()}
      disabled={props.isLoading}
    >
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradient, { borderRadius: borderRadius.lg }]}
      >
        {props.isLoading ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Text
            style={[
              styles.buttonText,
              { fontFamily: font.fontFamily },
              styles.activeButtonText
            ]}
          >
            {props.title}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonSmall: {
    height: 40,
    minWidth: 120,
    paddingHorizontal: 16,
  },
  buttonMedium: {
    height: 50,
    minWidth: 200,
    paddingHorizontal: 24,
  },
  buttonLarge: {
    height: 56,
    minWidth: 280,
    paddingHorizontal: 32,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  activeButtonText: {
    color: 'white',
  },
});

export default CustomButton;