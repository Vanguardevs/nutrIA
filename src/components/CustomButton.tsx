import {  TouchableOpacity, View, Text, Button, TextInput, StyleSheet, Modal } from "react-native";
import Theme from "../theme/theme";
import styles from "../theme/styles";
import { LinearGradient } from 'expo-linear-gradient';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
}

const CustomButton = ({ title, onPress }: CustomButtonProps) => {
  return (
    // <TouchableOpacity style={styles.button} onPress={onPress}>
    //   <Text style={styles.welcomeButtonText}> {title} </Text>
    // </TouchableOpacity>
<TouchableOpacity onPress={onPress}>
            
            <LinearGradient
            colors={['#2E8331', '#2F9933']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.welcomeButton}>
                
                <Text style={styles.welcomeButtonText}>{title}</Text>
            </LinearGradient>

            </TouchableOpacity>

  )
}

// const styless = StyleSheet.create({
//   button: {
//     backgroundColor: Theme.colors.primary,
//     borderRadius: Theme.borderRadius,
//     height: 38,
//     width: '90%',
//     justifyContent: 'center',
//     marginTop:3,
//     alignItems: 'center'
//   },
//   welcomeButtonText: {
//     fontFamily: Theme.font.fontFamily,
//     fontSize: Theme.font.fontSize,
//     textAlign: 'center',
//     color: 'white',
//   },
// });


export default CustomButton;