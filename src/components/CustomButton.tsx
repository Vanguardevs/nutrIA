import {  TouchableOpacity, View, Text, Button, TextInput, StyleSheet, Modal } from "react-native";
import Theme from "../theme/theme";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
}

const CustomButton = ({ title, onPress }: CustomButtonProps) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.welcomeButtonText}> {title} </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius,
    height: 38,
    width: '90%',
    justifyContent: 'center',
    marginTop:3,
    alignItems: 'center'
  },
  welcomeButtonText: {
    fontFamily: Theme.font.fontFamily,
    fontSize: Theme.font.fontSize,
    textAlign: 'center',
    color: 'white'
  },
});


export default CustomButton;