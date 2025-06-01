import { Ionicons } from 'react-native-vector-icons';
import React from 'react';
import { View, Text, StyleSheet, useColorScheme, Platform } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

interface CustomPickerProps {
  label: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
  options: { label: string; value: string }[];
}



const CustomPicker = ({ label, selectedValue, onValueChange, options }: CustomPickerProps) => {
  const colorScheme = useColorScheme();

  const background = colorScheme === 'dark' ? "#1C1C1E" : "white";
  const texts = colorScheme === 'dark' ? "#F2F2F2" : "#1C1C1E";

  return (
    <View style={styles.container1}>
      
      <View style={styles.container2}>

        <Text style={[styles.label, { color: texts }]}>{label}</Text>
        
        <RNPickerSelect
          useNativeAndroidPickerStyle={false}
          onValueChange={onValueChange}
          items={options}
          value={selectedValue}
          placeholder={{ label: "Selecione uma opção...", value: null }}
          style={{...pickerSelectStyles, iconContainer: {top:10, right:5}}}
        />

      </View>

      
    </View>
  );
};

const styles = StyleSheet.create({
  container2: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  container1:{
    flexDirection: 'row'
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingTop: 13,
    paddingHorizontal: 10,
    paddingBottom: 12,
    borderWidth: 2,
    borderColor: '#2E8331',
    borderRadius: 5,
    backgroundColor: 'white',
    color: '#333',
    marginBottom: 15,
    width: '100%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    paddingRight: 30
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: '#2E8331',
    borderRadius: 5,
    backgroundColor: 'white',
    color: '#333',
    marginBottom: 15,
    width: '100%',
    paddingRight: 40
  },
  inputWeb: {
    fontSize: 16,
    paddingTop: 13,
    paddingHorizontal: 10,
    paddingBottom: 12,
    borderWidth: 2,
    borderColor: '#2E8331',
    borderRadius: 5,
    backgroundColor: 'white',
    color: '#333',
    marginBottom: 15,
    width: '100%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    paddingRight: 30
    
  },
  placeholder: {
    color: '#999',
  },
});


export default CustomPicker;
