import { Ionicons } from "@expo/vector-icons";
import { View, TouchableOpacity, StyleSheet, TextInput, useColorScheme, Platform, Animated } from "react-native";

interface PropsCutomMessageCamp {
    message: string;
    setMessage: (text: string) => void;
    onSend?: () => void;
    onFocus?: () => void;
    placeholder?: string;
    isListening?: boolean;
    startListening?: () => void;
    stopListening?: () => void;
    micPulseAnim?: any;
    style?: any;
}

const CustomMessageCamp = ({ message, setMessage, onSend, onFocus, placeholder = "Digite sua mensagem...", isListening, startListening, stopListening, micPulseAnim, style }: PropsCutomMessageCamp) => {
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
            <View style={[styles.inputContainer, { backgroundColor: background, borderColor }, style]}>
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
                    textAlignVertical="top"
                    enablesReturnKeyAutomatically={true}
                    scrollEnabled={true}
                />
                <View style={styles.rightButtonsRow}>
                    <Animated.View style={{ transform: [{ scale: micPulseAnim || 1 }] }}>
                        <TouchableOpacity
                            onPress={isListening ? stopListening : startListening}
                            style={[
                                styles.micButton,
                                { 
                                    backgroundColor: isListening ? '#E8F4FD' : '#F2F2F7',
                                    borderColor: isListening ? '#007AFF' : '#D1D1D6',
                                    borderWidth: isListening ? 2 : 1,
                                    shadowColor: isListening ? '#007AFF' : '#000',
                                    shadowOffset: { width: 0, height: isListening ? 2 : 1 },
                                    shadowOpacity: isListening ? 0.3 : 0.1,
                                    shadowRadius: isListening ? 4 : 2,
                                    elevation: isListening ? 4 : 2,
                                }
                            ]}
                            activeOpacity={0.7}
                        >
                            <Ionicons 
                                name={isListening ? "mic" : "mic-outline"} 
                                size={20} 
                                color={isListening ? "#007AFF" : "#8E8E93"} 
                            />
                        </TouchableOpacity>
                    </Animated.View>
                    <View style={styles.sendButtonContainer}>
                        <TouchableOpacity
                            style={[
                                styles.sendButton,
                                { opacity: message.trim() ? 1 : 0.5 }
                            ]}
                            onPress={handleSend}
                            activeOpacity={0.7}
                            disabled={!message.trim()}
                        >
                            <Ionicons name="send" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 0,
        paddingVertical: 0,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
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
        minHeight: 60,
        maxHeight: 160,
        lineHeight: 20,
        backgroundColor: 'transparent',
        textAlignVertical: 'top',
    },
    rightButtonsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 4,
    },
    micButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 4,
        backgroundColor: '#F2F2F7',
        borderWidth: 1,
        borderColor: '#E1E1E1',
    },
    sendButtonContainer: {
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 44,
    },
    sendButton: {
        backgroundColor: '#2E8331',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 6,
        shadowColor: '#2E8331',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.12,
        shadowRadius: 2,
        elevation: 1,
    },
});

export default CustomMessageCamp;