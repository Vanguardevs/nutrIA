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
        <View style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
          <Text style={styles.label}>{title}</Text>
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            value={value}
            onChangeText={setValue}
            {...props}
          />
        </View>
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
    backgroundColor: "#fff",
    height: 40,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    width: '85%',
    marginLeft: '1%',
    borderColor: "#2E8331",
    borderWidth: 2,
    color:"#333",
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

});


export default CustomField;