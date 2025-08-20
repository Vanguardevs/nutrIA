import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface FabCreateDiaryProps {
  onPress: () => void;
  style?: ViewStyle;
}

const FabCreateDiary: React.FC<FabCreateDiaryProps> = ({ onPress, style }) => (
  <TouchableOpacity style={[styles.fabTop, style]} onPress={onPress}>
    <Ionicons name="add" size={32} color="#fff" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  fabTop: {
    backgroundColor: '#2E8331',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
});

export default FabCreateDiary;
