import {TouchableOpacity, View, Text, Button, TextInput, StyleSheet, Modal, useColorScheme } from "react-native";
import Theme from "../theme/theme";

interface CustomFieldProps extends TextInput { //Extende pra tudo que seja textinput
  title: string;
  placeholder: string;
  value: string;
  setValue: (text: string) => void;
  darkMode:string;
}

const CustomField: React.FC<CustomFieldProps> = ({ title, placeholder, value, setValue,  darkMode, ...props}) => {

  const colorSheme = useColorScheme();

  const background = colorSheme === 'dark'? "#1C1C1E" : "white"
  const texts = colorSheme === 'dark'? "#F2F2F2" : "#1C1C1E"

  return (
      <>
        <View style={styles.container}>
          <Text style={[styles.label,{color:texts}]}>{title}</Text>
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
  container:{
    justifyContent: 'center', 
    alignItems: 'center', 
    flexDirection: 'column'
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  labelD:{
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color:'white',
    textDecorationColor:'white'
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
  }
});


export default CustomField;