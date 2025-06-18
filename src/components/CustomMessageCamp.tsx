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
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: 'white',
        borderRadius: 25,
        paddingHorizontal: 16,
        paddingVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 3,
        borderWidth: 1.5,
        minHeight: 56,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        paddingVertical: Platform.OS === 'ios' ? 12 : 8,
        paddingHorizontal: 4,
        maxHeight: 120,
        minHeight: 40,
        lineHeight: Platform.OS === 'ios' ? 20 : 22,
    },
    sendButton: {
        backgroundColor: '#2E8331',
        borderRadius: 22,
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
        marginBottom: Platform.OS === 'ios' ? 2 : 0,
        shadowColor: '#2E8331',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 4,
        elevation: 2,
    },
});

export default CustomMessageCamp;