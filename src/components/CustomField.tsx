import {TouchableOpacity, View, Text, Button, TextInput, StyleSheet, Modal } from "react-native";
import Theme from "../theme/theme";

interface CustomFieldProps extends TextInput { //Extende pra tudo que seja textinput
  title: string;
  placeholder: string;
  value: string;
  setValue: (text: string) => void;
}

const CustomField: React.FC<CustomFieldProps> = ({ title, placeholder, value, setValue, ...props }) => {
  return (
    <>
      <Text style={styles.label}>{title}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={setValue}
        {...props}
      />
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    width: '85%',
  },

});


export default CustomField;