import { Ionicons } from "@expo/vector-icons";
import { View, TouchableOpacity, StyleSheet, TextInput, useColorScheme, Platform } from "react-native";

interface PropsCutomMessageCamp {
    message: string;
    setMessage: (text: string) => void;
    onSend?: () => void;
    onFocus?: () => void;
    placeholder?: string;
}

const CustomMessageCamp = ({ message, setMessage, onSend, onFocus, placeholder = "Digite sua mensagem..." }: PropsCutomMessageCamp) => {
    const colorScheme = useColorScheme();
    const background = colorScheme === 'dark'? "#1C1C1E" : "white";
    const texts = colorScheme === 'dark'? "#F2F2F2" : "#1C1C1E";
    const borderColor = colorScheme === 'dark' ? '#333' : '#2E8331';
    const placeholderColor = colorScheme === 'dark' ? '#888' : '#aaa';

    const handleSend = () => {
        if (message.trim() && onSend) {
            onSend();
        }
    };

    const handleSubmitEditing = () => {
        if (Platform.OS === 'ios') {
            handleSend();
        }
    };

    return (
        <View style={styles.container}>
            <View style={[styles.inputContainer, { backgroundColor: background, borderColor }]}>
                <TextInput
                    value={message}
                    onChangeText={setMessage}
                    placeholder={placeholder}
                    placeholderTextColor={placeholderColor}
                    multiline={true}
                    style={[styles.textInput, { color: texts }]}
                    maxLength={500}
                    returnKeyType="send"
                    onSubmitEditing={handleSubmitEditing}
                    onFocus={onFocus}
                    blurOnSubmit={false}
                    textAlignVertical="center"
                    enablesReturnKeyAutomatically={true}
                />
                <TouchableOpacity 
                    style={[
                        styles.sendButton,
                        { opacity: message.trim() ? 1 : 0.5 }
                    ]} 
                    onPress={handleSend} 
                    activeOpacity={0.7}
                    disabled={!message.trim()}
                >
                    <Ionicons name="send" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 0, // Remove padding externo
        paddingVertical: 0,   // Remove padding externo
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: 'white',
        borderRadius: 18,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: '#E5E5EA',
        minHeight: 44,
        maxHeight: 120,
        flex: 1,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        paddingVertical: Platform.OS === 'ios' ? 10 : 6,
        paddingHorizontal: 6,
        maxHeight: 120,
        minHeight: 32,
        lineHeight: 20,
        backgroundColor: 'transparent',
    },
    sendButton: {
        backgroundColor: '#2E8331',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 6,
        marginBottom: 0,
        shadowColor: '#2E8331',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.12,
        shadowRadius: 2,
        elevation: 1,
    },
});

export default CustomMessageCamp;