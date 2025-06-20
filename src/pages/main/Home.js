import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { 
    View, 
    TextInput, 
    TouchableOpacity, 
    FlatList, 
    StyleSheet, 
    Text, 
    Animated, 
    Alert,
    Dimensions,
    Platform,
    StatusBar,
    Keyboard,
    SafeAreaView,
    Image,
    KeyboardAvoidingView
} from 'react-native';
import Voice from '@react-native-voice/voice';
import { Ionicons } from '@expo/vector-icons';
import CustomMessageCamp from "../../components/CustomMessageCamp";
import axios from "axios";
import { auth } from "../../database/firebase";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const TAB_BAR_HEIGHT = Math.round(SCREEN_HEIGHT * 0.08); // 8% da tela, igual ao appRoute.js

// Componente animado para o balão de mensagem
const MessageBubble = React.memo(({ message, isUser, index, timestamp }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        // Reset animations
        fadeAnim.setValue(0);
        slideAnim.setValue(30);
        scaleAnim.setValue(0.8);

        // Staggered animation for multiple messages
        const delay = index * 100;

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                delay,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 400,
                delay,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                delay,
                useNativeDriver: true,
                tension: 100,
                friction: 8,
            })
        ]).start();
    }, [message, fadeAnim, slideAnim, scaleAnim, index]);

    return (
        <View style={{ flexDirection: isUser ? 'row-reverse' : 'row', alignItems: 'flex-end' }}>
            {!isUser && (
                <Image
                    source={require('../../../assets/icon.png')}
                    style={{ width: 32, height: 32, borderRadius: 16, marginRight: 6, marginLeft: 2 }}
                />
            )}
            <Animated.View
                style={[
                    styles.messageBubble,
                    {
                        alignSelf: isUser ? 'flex-end' : 'flex-start',
                        backgroundColor: isUser ? '#2E8331' : '#F2F2F7',
                        opacity: fadeAnim,
                        transform: [
                            { translateY: slideAnim },
                            { scale: scaleAnim }
                        ],
                    }
                ]}
            >
                <Text style={[
                    styles.messageText,
                    { color: isUser ? '#FFFFFF' : '#1C1C1E' }
                ]}>
                    {message}
                </Text>
                {timestamp && (
                    <Text style={{
                        color: isUser ? '#D0F5D8' : '#888',
                        fontSize: 11,
                        marginTop: 4,
                        textAlign: isUser ? 'right' : 'left',
                    }}>
                        {new Date(timestamp).toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </Text>
                )}
            </Animated.View>
        </View>
    );
});

// Componente para indicador de digitação
const TypingIndicator = ({ visible }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const dotAnims = useRef([
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0)
    ]).current;

    useEffect(() => {
        if (visible) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();

            // Animação dos pontos
            const animateDots = () => {
                const animations = dotAnims.map((anim, index) => 
                    Animated.sequence([
                        Animated.delay(index * 200),
                        Animated.timing(anim, {
                            toValue: 1,
                            duration: 600,
                            useNativeDriver: true,
                        }),
                        Animated.timing(anim, {
                            toValue: 0,
                            duration: 600,
                            useNativeDriver: true,
                        })
                    ])
                );
                
                Animated.loop(
                    Animated.parallel(animations)
                ).start();
            };

            animateDots();
        } else {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [visible, fadeAnim, dotAnims]);

    if (!visible) return null;

    return (
        <Animated.View style={[styles.typingContainer, { opacity: fadeAnim }]}>
            <View style={styles.typingBubble}>
                <View style={styles.dotsContainer}>
                    {dotAnims.map((anim, index) => (
                        <Animated.View
                            key={index}
                            style={[
                                styles.dot,
                                { opacity: anim }
                            ]}
                        />
                    ))}
                </View>
            </View>
        </Animated.View>
    );
};

// Componente principal
export default function Home({ navigation }) {
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    
    const flatListRef = useRef(null);
    const micPulseAnim = useRef(new Animated.Value(1)).current;
    const inputContainerAnim = useRef(new Animated.Value(0)).current;

    // Animação de pulso para o botão do microfone
    useEffect(() => {
        if (isListening) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(micPulseAnim, {
                        toValue: 1.2,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(micPulseAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    })
                ])
            ).start();
        } else {
            micPulseAnim.setValue(1);
        }
    }, [isListening, micPulseAnim]);

    // Monitorar teclado
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            (e) => {
                setKeyboardHeight(e.endCoordinates.height);
                Animated.timing(inputContainerAnim, {
                    toValue: Platform.OS === 'ios' ? -e.endCoordinates.height + 34 : 0,
                    duration: 250,
                    useNativeDriver: true,
                }).start();
            }
        );

        const keyboardDidHideListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => {
                setKeyboardHeight(0);
                Animated.timing(inputContainerAnim, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }).start();
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, [inputContainerAnim]);

    // Configuração dos listeners de voz com verificação de disponibilidade
    useEffect(() => {
        if (!Voice) {
            console.warn('Voice module não está disponível');
            return;
        }

        const onSpeechStart = () => {
            console.log('Reconhecimento de voz iniciado');
        };

        const onSpeechEnd = () => {
            console.log('Reconhecimento de voz finalizado');
            setIsListening(false);
        };

        const onSpeechResults = (event) => {
            if (event.value && event.value.length > 0) {
                setInput(event.value[0]);
            }
        };

        const onSpeechError = (error) => {
            setIsListening(false);
            Alert.alert('Erro', 'Erro no reconhecimento de voz. Tente novamente.');
        };

        Voice.onSpeechStart = onSpeechStart;
        Voice.onSpeechEnd = onSpeechEnd;
        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechError = onSpeechError;

        return () => {
            Voice.onSpeechStart = null;
            Voice.onSpeechEnd = null;
            Voice.onSpeechResults = null;
            Voice.onSpeechError = null;
        };
    }, []);

    // Inicia o reconhecimento de voz
    const startListening = async () => {
        try {
            if (!Voice || typeof Voice.start !== 'function') {
                Alert.alert('Erro', 'Reconhecimento de voz não está disponível neste dispositivo.');
                return;
            }

            setIsListening(true);
            await Voice.start('pt-BR');
        } catch (error) {
            console.error('Erro ao iniciar reconhecimento de voz:', error);
            setIsListening(false);
            Alert.alert('Erro', 'Não foi possível iniciar o reconhecimento de voz.');
        }
    };

    // Para o reconhecimento de voz
    const stopListening = async () => {
        try {
            if (Voice && typeof Voice.stop === 'function') {
                await Voice.stop();
            }
            setIsListening(false);
        } catch (error) {
            console.error('Erro ao parar reconhecimento de voz:', error);
            setIsListening(false);
        }
    };

    // Função para enviar mensagem
    const handleSend = useCallback(async () => {
        if (input.trim() === '') return;

        const newMessage = {
            id: `${Date.now()}_${Math.random()}`,
            message: input.trim(),
            isUser: true,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, newMessage]);
        setInput('');

        setIsTyping(true);

        try {
            const userID = auth.currentUser?.uid;
            const response = await axios.post("https://nutria-6uny.onrender.com/question", {
                "pergunta": newMessage.message,
                "id_user": userID
            });

            let respostaLimpa = response.data.message.resposta.replace(/\*\*/g, '');
            respostaLimpa = respostaLimpa.replace(/\*/g, '');

            const botResponse = {
                id: `bot_${Date.now()}_${Math.random()}`,
                message: respostaLimpa,
                isUser: false,
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, botResponse]);
        } catch (error) {
            const botResponse = {
                id: `bot_${Date.now()}_${Math.random()}`,
                message: "Desculpe, houve um erro ao buscar a resposta.",
                isUser: false,
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, botResponse]);
        } finally {
            setIsTyping(false);
        }
    }, [input]);

    // Função para limpar mensagens
    const handleClearMessages = useCallback(() => {
        Alert.alert(
            'Apagar chat',
            'Tem certeza que deseja apagar todas as mensagens?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { 
                    text: 'Apagar', 
                    style: 'destructive', 
                    onPress: () => {
                        setMessages([]);
                        setIsTyping(false);
                    }
                }
            ]
        );
    }, []);

    // Auto-scroll para a última mensagem
    useEffect(() => {
        if (flatListRef.current && (messages.length > 0 || isTyping)) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages, isTyping]);

    // Configuração do botão de apagar no header
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity 
                        onPress={handleClearMessages} 
                        style={styles.headerButton}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="trash-outline" size={24} color="#FF3B30" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('Config')}
                        style={styles.headerGreenButton}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="options" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation, handleClearMessages]);

    const renderMessage = useCallback(({ item, index }) => (
        <MessageBubble 
            message={item.message} 
            isUser={item.isUser} 
            index={index}
            timestamp={item.timestamp}
        />
    ), []);

    const keyExtractor = useCallback((item) => item.id, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={TAB_BAR_HEIGHT}
            >
                <View style={styles.chatContainer}>
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        renderItem={renderMessage}
                        keyExtractor={keyExtractor}
                        contentContainerStyle={[
                            styles.messagesList,
                            {
                                paddingBottom: TAB_BAR_HEIGHT + 16, // Garante espaço para o input acima da tab bar
                                minHeight: messages.length === 0 ? SCREEN_HEIGHT * 0.7 : undefined
                            }
                        ]}
                        showsVerticalScrollIndicator={false}
                        removeClippedSubviews={Platform.OS === 'android'}
                        maxToRenderPerBatch={10}
                        windowSize={10}
                        ListEmptyComponent={() => (
                            <View style={styles.emptyContainer}>
                                <Ionicons name="chatbubbles-outline" size={64} color="#C7C7CC" />
                                <Text style={styles.emptyText}>Nenhuma mensagem ainda</Text>
                                <Text style={styles.emptySubText}>
                                    Envie uma mensagem ou use o microfone para começar
                                </Text>
                            </View>
                        )}
                    />
                </View>
                <View style={{ width: '100%', marginBottom: 32 }}>
                    <TypingIndicator visible={isTyping} />
                </View>
                <Animated.View 
                    style={[
                        styles.inputContainer,
                        { 
                            transform: [{ translateY: inputContainerAnim }],
                            marginBottom: TAB_BAR_HEIGHT + 12 // Mais distância do input para a tab bar
                        }
                    ]}
                >
                    <CustomMessageCamp
                        message={input}
                        setMessage={setInput}
                        onSend={handleSend}
                        style={styles.messageInput}
                        isListening={isListening}
                        startListening={startListening}
                        stopListening={stopListening}
                        micPulseAnim={micPulseAnim}
                    />
                </Animated.View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FB',
    },
    chatContainer: {
        flex: 1,
    },
    messagesList: {
        paddingVertical: 20,
        paddingHorizontal: 14,
        flexGrow: 1,
        paddingBottom: 120,
    },
    messageBubble: {
        marginVertical: 6,
        marginHorizontal: 6,
        paddingHorizontal: 18,
        paddingVertical: 13,
        borderRadius: 22,
        minHeight: 40,
        maxWidth: SCREEN_WIDTH * 0.75,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 3,
        elevation: 2,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '400',
        color: '#222',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingHorizontal: 0,
        paddingBottom: 8,
        backgroundColor: '#F8F9FB',
    },
    micButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        marginBottom: 0,
        backgroundColor: '#F2F2F7',
        borderWidth: 1,
        borderColor: '#E1E1E1',
    },
    headerButton: {
        marginRight: 8,
        padding: 4,
        borderRadius: 8,
        backgroundColor: '#FFF',
    },
    headerGreenButton: {
        marginRight: 12,
        marginLeft: 4,
        marginBottom: 8,
        backgroundColor: '#2E8331',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#2E8331',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.12,
        shadowRadius: 2,
        elevation: 1,
    },
    messageInput: {
        flex: 1,
        minHeight: 60,
        maxHeight: 160,
        maxWidth: '100%',
        backgroundColor: '#F8F9FB',
        borderRadius: 14,
        paddingHorizontal: 10,
        fontSize: 15,
        marginBottom: 0,
        borderWidth: 1,
        borderColor: '#E5E5EA',
    },
    typingContainer: {
        paddingHorizontal: 14,
        paddingBottom: 8,
        alignItems: 'flex-start',
        width: '100%',
    },
    typingBubble: {
        backgroundColor: '#E9F0FB',
        borderRadius: 18,
        paddingHorizontal: 16,
        paddingVertical: 10,
        alignSelf: 'flex-start',
        marginLeft: 8,
        marginBottom: 8,
    },
    dotsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 18,
    },
    dot: {
        width: 7,
        height: 7,
        borderRadius: 3.5,
        backgroundColor: '#8E8E93',
        marginHorizontal: 2,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        marginTop: SCREEN_HEIGHT * 0.18,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#8E8E93',
        marginTop: 16,
        textAlign: 'center',
    },
    emptySubText: {
        fontSize: 16,
        color: '#C7C7CC',
        marginTop: 8,
        textAlign: 'center',
        lineHeight: 22,
    },
});