import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

interface CustomPickerProps {
  label: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
  options: { label: string; value: string }[];
}

const CustomPicker = ({ label, selectedValue, onValueChange, options }: CustomPickerProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <RNPickerSelect
        onValueChange={onValueChange}
        items={options}
        value={selectedValue}
        style={{
          inputAndroid: styles.picker,
          inputIOS: styles.picker,
          placeholder: styles.placeholder,
        }}
        placeholder={{ label: "Selecione uma opção...", value: null }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '40%',
    marginBottom: 15,
    marginRight: 'auto'
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#333',
  },
  picker: {
    height: 60,
    width: '80%',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  placeholder: {
    color: '#999',
  },
});

export default CustomPicker;