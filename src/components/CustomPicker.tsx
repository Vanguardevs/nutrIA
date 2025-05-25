import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

interface CustomPickerProps {
  label: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
  options: { label: string; value: string }[];
}

const CustomPicker = ({ label, selectedValue, onValueChange, options }: CustomPickerProps) => {

  const colorSheme = useColorScheme();

  const background = colorSheme === 'dark'? "#1C1C1E" : "white"
  const texts = colorSheme === 'dark'? "#F2F2F2" : "#1C1C1E"

  return (
    <View style={styles.container}>
      <Text style={[styles.label,{color:texts}]}>{label}</Text>
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
    width: '73%',
    marginBottom: 15,
    textAlign: 'center'
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center'
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