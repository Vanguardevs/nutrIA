import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Theme from "../theme/theme";

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
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={styles.picker}
        >
          {options.map((opt, index) => (
            <Picker.Item key={index} label={opt.label} value={opt.value} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '45%',
    marginLeft: '5%',
    marginBottom: 15,
  },
  label: {               // TEXTO EM CIMA DO INPUT
    fontSize: 19,
    marginBottom: 5,
    textAlign: 'center',
    fontWeight: "bold",
  },
  pickerWrapper: {      // INPUT
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
  picker: {
    height: 35,
    width: '100%',
  },
});

// height: 35,
// borderColor: "#ccc",
// borderWidth: 1,
// borderRadius: 5,
// paddingHorizontal: 10,
// marginBottom:15,
// width: '65%',
// marginLeft: '5%'

export default CustomPicker;
