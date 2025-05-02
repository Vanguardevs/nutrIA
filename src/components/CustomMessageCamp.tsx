import { Ionicons } from "@expo/vector-icons";
import {useColorScheme, View, TouchableOpacity, StyleSheet, TextInput } from "react-native";

interface PropsCutomMessageCamp {
    message: string;
    setMessage: (text: string) => void;
    onSend?: () => void;
}

const CustomMessageCamp = ({ message, setMessage, onSend }: PropsCutomMessageCamp) => {
    
    const colorSheme = useColorScheme();

    const background = colorSheme === 'dark'? "#1C1C1E" : "#F2F2F2";
    
    return (
        <View style={[styles.container,{ backgroundColor: background }]}>
            <View style={styles.inputContainer}>
                <TextInput
                    value={message}
                    onChangeText={text => setMessage(text)}
                    placeholder="Digite sua mensagem..."
                    multiline={true}
                    style={styles.textInput}
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
        backgroundColor: '#f5f5f5',
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
        textAlign: 'center',
        
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