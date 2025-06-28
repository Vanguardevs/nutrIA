import React, { useRef } from 'react';
import { TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderMapButtonProps {
  onPress: () => void;
}

export default function HeaderMapButton({ onPress }: HeaderMapButtonProps) {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;

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
    outputRange: ['0deg', '360deg'],
  });

  return (
    <TouchableOpacity onPress={handlePress}>
      <Animated.View
        style={[
          {
            marginRight: 8,
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
        <Ionicons name="map" size={24} color="#FFF" />
      </Animated.View>
    </TouchableOpacity>
  );
} 