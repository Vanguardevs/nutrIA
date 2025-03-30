import { View, Text, Button, TextInput, StyleSheet, Modal } from "react-native";
import { TouchableOpacity } from "react-native";
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
    height: 30,
    width: '100%',
    justifyContent: 'center'
  },
  welcomeButtonText: {
    fontFamily: Theme.font.fontFamily,
    fontSize: Theme.font.fontSize,
    textAlign: 'center',
    color: 'white'
  },
});


export default CustomButton;