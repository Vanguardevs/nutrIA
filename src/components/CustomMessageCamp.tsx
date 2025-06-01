import { Ionicons } from "@expo/vector-icons";
import { View, TouchableOpacity, StyleSheet, TextInput, useColorScheme } from "react-native";

interface PropsCutomMessageCamp {
    message: string;
    setMessage: (text: string) => void;
    onSend?: () => void;
}

const CustomMessageCamp = ({ message, setMessage, onSend}: PropsCutomMessageCamp) => {
    
    const colorSheme = useColorScheme();

    const background = colorSheme === 'dark'? "#1C1C1E" : "white"
    const texts = colorSheme === 'dark'? "#F2F2F2" : "#1C1C1E"

    return (
        <View style={[styles.container,{ backgroundColor: 'transparent'}]}>
            <View style={[styles.inputContainer,{backgroundColor: background}]}>
                <TextInput
                    value={message}
                    onChangeText={text => setMessage(text)}
                    placeholder="Digite sua mensagem..."
                    multiline={true}
                    style={[styles.textInput,{color: texts, textDecorationColor: texts}]}
                />
                <TouchableOpacity style={styles.sendButton} onPress={onSend}>
                    <Ionicons name="send" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: 'transparent',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 25,
        paddingHorizontal: 10,
        paddingVertical: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    textInput: {
        flex: 1,
        fontSize: 20,
        paddingVertical: 10,
        paddingHorizontal: 10,
        color: '#333',
        
    },
    sendButton: {
        backgroundColor: '#2E8331',
        borderRadius: 20,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
});

export default CustomMessageCamp;