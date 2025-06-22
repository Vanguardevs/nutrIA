import React, { useCallback, useMemo, useRef, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { View, TouchableOpacity, StyleSheet, TextInput, useColorScheme, Platform, Animated, Keyboard, Text } from "react-native";

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
    isTyping?: boolean;
}

const CustomMessageCamp = React.memo(({ 
    message, 
    setMessage, 
    onSend, 
    onFocus, 
    placeholder = "Digite sua mensagem...", 
    isListening, 
    startListening, 
    stopListening, 
    micPulseAnim, 
    style,
    isTyping = false
}: PropsCutomMessageCamp) => {
    const colorScheme = useColorScheme();
    const textInputRef = useRef<TextInput>(null);
    const [inputHeight, setInputHeight] = useState(44);
    const [isFocused, setIsFocused] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    
    const themeColors = useMemo(() => ({
        background: colorScheme === 'dark' ? "#1C1C1E" : "white",
        texts: colorScheme === 'dark' ? "#F2F2F2" : "#1C1C1E",
        borderColor: colorScheme === 'dark' ? '#333' : isFocused ? '#2E8331' : '#E5E5EA',
        placeholderColor: colorScheme === 'dark' ? '#888' : '#aaa',
        focusBorderColor: '#2E8331',
    }), [colorScheme, isFocused]);

    // Auto-resize do input baseado no conteúdo
    const handleContentSizeChange = useCallback((event: any) => {
        const { height } = event.nativeEvent.contentSize;
        const maxHeight = 100; // Altura máxima reduzida
        const minHeight = 44; // Altura mínima
        const padding = 16; // Padding adicional para evitar overflow
        const newHeight = Math.max(minHeight, Math.min(height + padding, maxHeight));
        setContentHeight(height);
        setInputHeight(newHeight);
    }, []);

    // Foco automático quando necessário
    const focusInput = useCallback(() => {
        textInputRef.current?.focus();
    }, []);

    // Desfoca o input quando envia mensagem
    const blurInput = useCallback(() => {
        textInputRef.current?.blur();
        Keyboard.dismiss();
    }, []);

    const handleSend = useCallback(() => {
        if (message.trim() && onSend) {
            onSend();
            blurInput();
            // Reset da altura após envio
            setTimeout(() => {
                setInputHeight(44);
                setContentHeight(0);
            }, 100);
        }
    }, [message, onSend, blurInput]);

    const handleSubmitEditing = useCallback(() => {
        if (Platform.OS === 'ios') {
            handleSend();
        }
    }, [handleSend]);

    const handleMicPress = useCallback(() => {
        if (isListening) {
            stopListening?.();
        } else {
            startListening?.();
            // Foca no input após iniciar gravação
            setTimeout(focusInput, 100);
        }
    }, [isListening, startListening, stopListening, focusInput]);

    // Atalho de teclado para enviar (Enter)
    const handleKeyPress = useCallback((event: any) => {
        if (event.nativeEvent.key === 'Enter' && !event.nativeEvent.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    }, [handleSend]);

    // Animação de foco
    const focusAnim = useRef(new Animated.Value(0)).current;
    
    useEffect(() => {
        Animated.timing(focusAnim, {
            toValue: isFocused ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [isFocused, focusAnim]);

    const micButtonStyle = useMemo(() => [
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
    ], [isListening]);

    const sendButtonStyle = useMemo(() => [
        styles.sendButton,
        { 
            opacity: message.trim() && !isTyping ? 1 : 0.5,
            backgroundColor: message.trim() && !isTyping ? '#2E8331' : '#C7C7CC'
        }
    ], [message, isTyping]);

    const inputContainerStyle = useMemo(() => [
        styles.inputContainer, 
        { 
            backgroundColor: themeColors.background, 
            borderColor: themeColors.borderColor,
            height: inputHeight,
            borderWidth: isFocused ? 2 : 1,
            maxHeight: 100, // Altura máxima reduzida para evitar overflow
        }, 
        style
    ], [themeColors.background, themeColors.borderColor, inputHeight, isFocused, style]);

    const textInputStyle = useMemo(() => [
        styles.textInput, 
        { 
            color: themeColors.texts,
            height: Math.max(44, Math.min(contentHeight + 8, 80)), // Altura mais conservadora
            maxHeight: 80, // Altura máxima reduzida do texto
        }
    ], [themeColors.texts, contentHeight]);

    return (
        <View style={styles.container}>
            <Animated.View style={[
                inputContainerStyle,
                {
                    shadowColor: themeColors.focusBorderColor,
                    shadowOffset: { width: 0, height: isFocused ? 2 : 1 },
                    shadowOpacity: isFocused ? 0.15 : 0.05,
                    shadowRadius: isFocused ? 6 : 3,
                    elevation: isFocused ? 4 : 2,
                }
            ]}>
                <TextInput
                    ref={textInputRef}
                    value={message}
                    onChangeText={setMessage}
                    placeholder={placeholder}
                    placeholderTextColor={themeColors.placeholderColor}
                    multiline={true}
                    style={textInputStyle}
                    maxLength={1000} // Aumentado para permitir mensagens mais longas
                    returnKeyType="send"
                    onSubmitEditing={handleSubmitEditing}
                    onFocus={() => {
                        setIsFocused(true);
                        onFocus?.();
                    }}
                    onBlur={() => setIsFocused(false)}
                    blurOnSubmit={false}
                    textAlignVertical="top"
                    enablesReturnKeyAutomatically={true}
                    scrollEnabled={true}
                    onContentSizeChange={handleContentSizeChange}
                    onKeyPress={handleKeyPress}
                    autoCapitalize="sentences"
                    autoCorrect={true}
                    spellCheck={true}
                    contextMenuHidden={false}
                    selectionColor={themeColors.focusBorderColor}
                />
                <View style={styles.rightButtonsRow}>
                    <Animated.View style={{ transform: [{ scale: micPulseAnim || 1 }] }}>
                        <TouchableOpacity
                            onPress={handleMicPress}
                            style={micButtonStyle}
                            activeOpacity={0.7}
                            disabled={isTyping}
                        >
                            <Ionicons 
                                name={isListening ? "mic" : "mic-outline"} 
                                size={20} 
                                color={isListening ? "#007AFF" : isTyping ? "#C7C7CC" : "#8E8E93"} 
                            />
                        </TouchableOpacity>
                    </Animated.View>
                    <View style={styles.sendButtonContainer}>
                        <TouchableOpacity
                            style={sendButtonStyle}
                            onPress={handleSend}
                            activeOpacity={0.7}
                            disabled={!message.trim() || isTyping}
                        >
                            <Ionicons 
                                name={isTyping ? "time-outline" : "send"} 
                                size={20} 
                                color="white" 
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
            
            {/* Indicador de caracteres */}
            {message.length > 0 && (
                <View style={styles.charCounter}>
                    <Text style={[
                        styles.charCounterText,
                        { color: message.length > 800 ? '#FF3B30' : '#8E8E93' }
                    ]}>
                        {message.length}/1000
                    </Text>
                </View>
            )}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 0,
        paddingVertical: 0,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end', // Mudado para flex-end para melhor alinhamento
        backgroundColor: 'white',
        borderRadius: 22, // Aumentado para um visual mais moderno
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#E5E5EA',
        minHeight: 44,
        maxHeight: 100, // Altura máxima reduzida para evitar overflow
        flex: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        paddingVertical: Platform.OS === 'ios' ? 8 : 6,
        paddingHorizontal: 8,
        minHeight: 44,
        maxHeight: 80, // Altura máxima reduzida para evitar overflow
        lineHeight: 20,
        backgroundColor: 'transparent',
        textAlignVertical: 'top',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
        overflow: 'hidden', // Prevenir overflow
    },
    rightButtonsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 6,
        alignSelf: 'flex-end',
        flexShrink: 0, // Impedir que os botões encolham
    },
    micButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 6,
        backgroundColor: '#F2F2F7',
        borderWidth: 1,
        borderColor: '#E1E1E1',
        flexShrink: 0, // Impedir que o botão encolha
    },
    sendButtonContainer: {
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 44,
        flexShrink: 0, // Impedir que o container encolha
    },
    sendButton: {
        backgroundColor: '#2E8331',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 4,
        shadowColor: '#2E8331',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.12,
        shadowRadius: 2,
        elevation: 1,
        flexShrink: 0, // Impedir que o botão encolha
    },
    charCounter: {
        position: 'relative',
        alignSelf: 'flex-end',
        marginTop: 8,
        marginRight: 12,
        backgroundColor: 'rgba(0,0,0,0.08)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
        zIndex: 1000,
    },
    charCounterText: {
        fontSize: 12,
        fontWeight: '600',
    },
});

export default CustomMessageCamp;