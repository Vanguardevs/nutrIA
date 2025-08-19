import {TouchableOpacity, View, Text, Button, TextInput, StyleSheet, Modal, useColorScheme } from "react-native";
import { useTheme } from '../../theme/theme';

interface CustomFieldProps extends TextInput { //Extende pra tudo que seja textinput
  title: string;
  placeholder: string;
  value: string;
  setValue: (text: string) => void;
  darkMode:string;
}

const CustomField: React.FC<CustomFieldProps> = ({ title, placeholder, value, setValue,  darkMode, ...props}) => {
  const colorScheme = useColorScheme();
  const background = colorScheme === 'dark'? "#1C1C1E" : "#fff";
  const texts = colorScheme === 'dark'? "#F2F2F2" : "#1C1C1E";
  const borderColor = colorScheme === 'dark' ? '#333' : '#2E8331';

  return (
      <View style={[styles.container]}> 
        <Text style={[styles.label,{color:texts}]}>{title}</Text>
        <TextInput
          style={[styles.input, {backgroundColor: background, color: texts, borderColor, textAlign: 'center'}]}
          placeholder={placeholder}
          placeholderTextColor={colorScheme === 'dark' ? '#888' : '#aaa'}
          value={value}
          onChangeText={setValue}
          maxLength={200}
          returnKeyType="done"
          {...props}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container:{
    justifyContent: 'center', 
    alignItems: 'center', 
    flexDirection: 'column',
    width: '100%',
    marginBottom: 10,
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
    height: 44,
    borderRadius: 18,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    fontSize: 17,
    width: '95%',
    marginBottom: 5,
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
    minHeight: 44,
    maxHeight: 120,
  }
});


export default CustomField;