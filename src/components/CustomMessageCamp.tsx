import React, { useCallback, useMemo, useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { Ionicons } from "@expo/vector-icons";
import { View, TouchableOpacity, StyleSheet, TextInput, useColorScheme, Platform, Animated, Keyboard, Text } from "react-native";

interface PropsCutomMessageCamp {
    value?: string;
    onChangeText?: (text: string) => void;
    onSend?: () => void;
    onFocus?: () => void;
    placeholder?: string;
    isListening?: boolean;
    startListening?: () => void;
    stopListening?: () => void;
    micPulseAnim?: any;
    style?: any;
    isTyping?: boolean;
    onOpenSuggestions?: () => void;
}

interface CustomMessageCampRef {
    focus: () => void;
    blur: () => void;
    clear: () => void;
}

const CustomMessageCamp = forwardRef<CustomMessageCampRef, PropsCutomMessageCamp>(({ 
    value = '', 
    onChangeText, 
    onSend, 
    onFocus, 
    placeholder = "Digite sua mensagem...", 
    isListening, 
    startListening, 
    stopListening, 
    micPulseAnim, 
    style,
    isTyping = false,
    onOpenSuggestions
}, ref) => {
    const colorScheme = useColorScheme();
    const textInputRef = useRef<TextInput>(null);
    const [inputHeight, setInputHeight] = useState(44);
    const [isFocused, setIsFocused] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    
    // Expor métodos para o ref
    useImperativeHandle(ref, () => ({
        focus: () => textInputRef.current?.focus(),
        blur: () => textInputRef.current?.blur(),
        clear: () => {
            if (onChangeText) onChangeText('');
        }
    }));
    
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
        const maxHeight = 120; // Aumentado para acomodar os ícones
        const minHeight = 50; // Aumentado para dar mais espaço
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
        if (value && value.trim() && onSend) {
            onSend();
            blurInput();
            // Reset da altura após envio
            setTimeout(() => {
                setInputHeight(50);
                setContentHeight(0);
            }, 100);
        }
    }, [value, onSend, blurInput]);

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
            opacity: value && value.trim() && !isTyping ? 1 : 0.5,
            backgroundColor: value && value.trim() && !isTyping ? '#2E8331' : '#C7C7CC'
        }
    ], [value, isTyping]);

    const inputContainerStyle = useMemo(() => [
        styles.inputContainer, 
        { 
            backgroundColor: themeColors.background, 
            borderColor: themeColors.borderColor,
            height: inputHeight,
            borderWidth: isFocused ? 2 : 1,
            maxHeight: 120, // Aumentado para acomodar os ícones
            minHeight: 50, // Aumentado para dar mais espaço
        }, 
        style
    ], [themeColors.background, themeColors.borderColor, inputHeight, isFocused, style]);

    const textInputStyle = useMemo(() => [
        styles.textInput, 
        { 
            color: themeColors.texts,
            height: Math.max(50, Math.min(contentHeight + 8, 100)), // Aumentado para acomodar os ícones
            maxHeight: 100, // Aumentado para acomodar mais texto
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
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={themeColors.placeholderColor}
                    multiline={true}
                    style={textInputStyle}
                    maxLength={1000}
                    returnKeyType="send"
                    onSubmitEditing={handleSubmitEditing}
                    onFocus={() => {
                        setIsFocused(true);
                        onFocus?.();
                    }}
                    onBlur={() => setIsFocused(false)}
                    onContentSizeChange={handleContentSizeChange}
                    onKeyPress={handleKeyPress}
                />
                {isTyping ? (
                    <View style={styles.iconButton}>
                        <View style={styles.waitIconBg}>
                            <Ionicons name="time-outline" size={22} color="#fff" />
                        </View>
                    </View>
                ) : (!value || value.trim().length === 0) ? (
                    <TouchableOpacity onPress={onOpenSuggestions} style={styles.iconButton}>
                        <View style={styles.iconBg}>
                            <Ionicons name="add" size={24} color="#fff" />
                        </View>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={handleSend} style={styles.iconButton} disabled={!value || !value.trim()}>
                        <View style={styles.iconBg}>
                            <Ionicons name="send" size={22} color="#fff" />
                        </View>
                    </TouchableOpacity>
                )}
            </Animated.View>
            
            {/* Indicador de caracteres */}
            {value && value.length > 0 && (
                <View style={styles.charCounter}>
                    <Text style={[
                        styles.charCounterText,
                        { color: value.length > 800 ? '#FF3B30' : '#8E8E93' }
                    ]}>
                        {value.length}/1000
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
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 25,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#E5E5EA',
        minHeight: 50,
        maxHeight: 120,
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
        paddingVertical: Platform.OS === 'ios' ? 10 : 8,
        paddingHorizontal: 8,
        minHeight: 50,
        maxHeight: 100,
        lineHeight: 20,
        backgroundColor: 'transparent',
        textAlignVertical: 'top',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
        overflow: 'hidden',
    },
    rightButtonsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
        alignSelf: 'center',
        flexShrink: 0,
    },
    micButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        backgroundColor: '#F2F2F7',
        borderWidth: 1,
        borderColor: '#E1E1E1',
        flexShrink: 0,
    },
    sendButtonContainer: {
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 50,
        flexShrink: 0,
    },
    sendButton: {
        backgroundColor: '#2E8331',
        borderRadius: 22,
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 4,
        shadowColor: '#2E8331',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.12,
        shadowRadius: 2,
        elevation: 1,
        flexShrink: 0,
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
    iconButton: {
        padding: 0,
        alignItems: 'center',
        justifyContent: 'center',
        height: 44,
        width: 44,
    },
    iconBg: {
        backgroundColor: '#2E8331',
        borderRadius: 22,
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    waitIconBg: {
        backgroundColor: 'rgba(229,229,234,0.85)', // cinza claro meio transparente
        borderRadius: 22,
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default CustomMessageCamp;