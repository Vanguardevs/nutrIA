import React, { useState, useRef, useEffect, useLayoutEffect, useCallback, useMemo } from 'react';
import { 
    View, 
    TextInput, 
    TouchableOpacity, 
    FlatList, 
    StyleSheet, 
    Text, 
    Animated,
    Dimensions,
    Platform,
    StatusBar,
    Keyboard,
    SafeAreaView,
    Image,
    KeyboardAvoidingView,
    Alert,
    Modal,
    TouchableWithoutFeedback,
    ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomMessageCamp from "../../components/CustomMessageCamp";
import HeaderMapButton from "../../components/HeaderMapButton";
import axios from "axios";
import { auth } from "../../database/firebase";
import { cachedRequest } from "../../utils/apiCache";
import { API_URLS, API_CONFIG, getCurrentConfig } from "../../config/apiConfig";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const TAB_BAR_HEIGHT = Math.round(SCREEN_HEIGHT * 0.08);

// Componente para balão de mensagem
const MessageBubble = React.memo(({ message, isUser, index }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                delay: index * 50,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 250,
                delay: index * 50,
                useNativeDriver: true,
            })
        ]).start();
    }, [message, fadeAnim, slideAnim, index]);

    return (
        <View style={{ flexDirection: isUser ? 'row-reverse' : 'row', alignItems: 'flex-end', marginVertical: 4 }}>
            {!isUser && (
                <Image
                    source={require('../../../assets/icon.png')}
                    style={{ width: 32, height: 32, borderRadius: 16, marginRight: 8, marginLeft: 4 }}
                />
            )}
            <Animated.View
                style={[
                    styles.messageBubble,
                    {
                        alignSelf: isUser ? 'flex-end' : 'flex-start',
                        backgroundColor: isUser ? '#2E8331' : '#F2F2F7',
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    }
                ]}
            >
                <Text style={[
                    styles.messageText,
                    { color: isUser ? '#FFFFFF' : '#1C1C1E' }
                ]}>
                    {message}
                </Text>
            </Animated.View>
        </View>
    );
});

// Componente para indicador de digitação
const TypingIndicator = React.memo(({ visible }) => {
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
                duration: 200,
                useNativeDriver: true,
            }).start();

            const animateDots = () => {
                const animations = dotAnims.map((anim, index) => 
                    Animated.sequence([
                        Animated.delay(index * 150),
                        Animated.timing(anim, {
                            toValue: 1,
                            duration: 400,
                            useNativeDriver: true,
                        }),
                        Animated.timing(anim, {
                            toValue: 0,
                            duration: 400,
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
                duration: 200,
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
});

// Componente para exemplos de perguntas - REDUZIDO
const QuestionExamples = React.memo(({ onQuestionPress }) => {
    const { width: screenWidth } = Dimensions.get('window');
    const isSmallScreen = screenWidth < 350;
    
    const examples = [
        {
            id: 1,
            title: "Calcular Calorias",
            description: "Calcule minhas calorias diárias",
            icon: "calculator-outline",
            iconColor: "#FF6B35",
            iconBg: "#FFF3E0"
        },
        {
            id: 2,
            title: "Criar Agenda",
            description: "Ajude-me a criar uma agenda alimentar",
            icon: "calendar-outline",
            iconColor: "#4ECDC4",
            iconBg: "#E0F2F1"
        },
        {
            id: 3,
            title: "Clínicas Próximas",
            description: "Mostre clínicas nutricionais próximas",
            icon: "location-outline",
            iconColor: "#45B7D1",
            iconBg: "#E3F2FD"
        },
        {
            id: 4,
            title: "Dicas Nutricionais",
            description: "Dê-me dicas para uma alimentação saudável",
            icon: "leaf-outline",
            iconColor: "#2E8331",
            iconBg: "#E8F5E8"
        }
    ];

    const handlePress = (example) => {
        onQuestionPress(example.description);
    };

    return (
        <View style={styles.examplesContainer}>
            <Text style={styles.examplesTitle}>💡 Exemplos de Perguntas</Text>
            <View style={styles.examplesGrid}>
                {examples.map((example) => (
                    <TouchableOpacity
                        key={example.id}
                        style={[
                            styles.exampleCard,
                            {
                                width: isSmallScreen ? '48%' : '48%',
                                padding: isSmallScreen ? 6 : 8,
                            }
                        ]}
                        onPress={() => handlePress(example)}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.exampleIconContainer, { backgroundColor: example.iconBg }]}>
                            <Ionicons 
                                name={example.icon} 
                                size={isSmallScreen ? 14 : 16} 
                                color={example.iconColor} 
                            />
                        </View>
                        <Text style={[
                            styles.exampleTitle,
                            { fontSize: isSmallScreen ? 10 : 11 }
                        ]}>
                            {example.title}
                        </Text>
                        <Text style={[
                            styles.exampleDescription,
                            { fontSize: isSmallScreen ? 8 : 9 }
                        ]}>
                            {example.description}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
});

// Componente de confirmação para excluir mensagens - COM ÍCONE DE LIXEIRA
const DeleteConfirmationModal = React.memo(({ visible, onConfirm, onCancel }) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(scaleAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [visible, scaleAnim, opacityAnim]);

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            onRequestClose={onCancel}
        >
            <Animated.View style={[styles.modalOverlay, { opacity: opacityAnim }]}>
                <Animated.View 
                    style={[
                        styles.modalContent,
                        { 
                            transform: [{ scale: scaleAnim }],
                        }
                    ]}
                >
                    <View style={styles.modalHeader}>
                        <View style={styles.modalIconContainer}>
                            <Ionicons name="trash" size={32} color="#FFFFFF" />
                        </View>
                        <Text style={styles.modalTitle}>Excluir Conversa</Text>
                        <Text style={styles.modalMessage}>
                            Tem certeza que deseja excluir toda a conversa? Esta ação não pode ser desfeita.
                        </Text>
                    </View>
                    
                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.cancelButton]}
                            onPress={onCancel}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={[styles.modalButton, styles.confirmButton]}
                            onPress={onConfirm}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.confirmButtonText}>Excluir</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
});

// Componente principal
export default function Home({ navigation }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    
    const flatListRef = useRef(null);
    const inputRef = useRef(null);

    const nutritionSuggestions = [
        "Me informe os valores nutricionais:",
        "Quais alimentos são ricos em proteína?",
        "Sugira um cardápio saudável para o café da manhã.",
        "Quais alimentos devo evitar para emagrecer?",
        "Como montar uma dieta balanceada?",
        "Quais são os benefícios da fibra alimentar?",
        "Como consumir mais vitaminas no dia a dia?",
        "Quais alimentos ajudam a controlar o colesterol?",
        "Me explique a diferença entre carboidrato simples e complexo.",
        "Quais alimentos são fontes de ferro?"
    ];

    // Monitora o teclado
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
        });

        return () => {
            keyboardDidShowListener?.remove();
            keyboardDidHideListener?.remove();
        };
    }, []);

    // Função para limpar mensagens com confirmação
    const handleClearMessages = useCallback(() => {
        setShowDeleteModal(true);
    }, []);

    // Função para confirmar exclusão
    const confirmDelete = useCallback(() => {
        setMessages([]);
        setIsTyping(false);
        setShowDeleteModal(false);
    }, []);

    // Função para cancelar exclusão
    const cancelDelete = useCallback(() => {
        setShowDeleteModal(false);
    }, []);

    // Define a função globalmente para acesso do header
    useEffect(() => {
        global.clearMessagesFunction = handleClearMessages;
        return () => {
            global.clearMessagesFunction = null;
        };
    }, [handleClearMessages]);

    // Função para forçar scroll para o final
    const scrollToBottom = useCallback(() => {
        if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, []);

    // Função separada para enviar mensagem para API
    const sendMessageToAPI = useCallback(async (messageText) => {
        try {
            const userID = auth.currentUser?.uid;
            
            const payloadFinal = {
                "pergunta": messageText,
                "id_user": userID,
            };

            const config = getCurrentConfig();
            console.log(`📤 Enviando pergunta para ${config.environment.toUpperCase()}:`, payloadFinal.pergunta);

            const response = await axios.post(API_URLS.QUESTION, payloadFinal, {
                timeout: API_CONFIG.TIMEOUT,
                headers: API_CONFIG.HEADERS
            });

            console.log('📥 Resposta recebida:', response.status);

            if (!response.data || !response.data.message || !response.data.message.resposta) {
                throw new Error('Estrutura de resposta inválida');
            }

            let respostaLimpa = response.data.message.resposta;
            
            if (typeof respostaLimpa === 'string') {
                respostaLimpa = respostaLimpa.replace(/\*\*/g, '');
                respostaLimpa = respostaLimpa.replace(/\*/g, '');
            }

            console.log('📥 Resposta limpa da IA:', respostaLimpa);

            const botResponse = {
                id: `bot_${Date.now()}_${Math.random()}`,
                message: respostaLimpa,
                isUser: false,
                timestamp: new Date().toISOString()
            };
            
            setMessages(prev => [...prev, botResponse]);
            
            setTimeout(() => {
                scrollToBottom();
            }, 100);
            
            setIsTyping(false);
            
        } catch (error) {
            console.error('❌ Erro ao enviar mensagem:', error);
            
            const errorMessage = {
                id: `error_${Date.now()}_${Math.random()}`,
                message: 'Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente.',
                isUser: false,
                timestamp: new Date().toISOString()
            };
            
            setMessages(prev => [...prev, errorMessage]);
        }
    }, [scrollToBottom]);

    // Função para enviar mensagem do input manual
    const handleSend = useCallback(async () => {
        if (!input || input.trim() === '') return;
        setIsTyping(true);
        const newMessage = {
            id: `${Date.now()}_${Math.random()}`,
            message: input.trim(),
            isUser: true,
            timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, newMessage]);
        setInput('');
        setTimeout(() => {
            scrollToBottom();
        }, 50);
        // Chama a API
        sendMessageToAPI(newMessage.message);
    }, [input, scrollToBottom, sendMessageToAPI]);

    // Função para lidar com cliques nas sugestões
    const handleQuestionPress = useCallback((text) => {
        if (text && text.trim()) {
            setInput(text.trim());
            // Usa setTimeout para garantir que o input seja atualizado antes de enviar
            setTimeout(() => {
                // Chama handleSend diretamente sem dependência
                if (text.trim()) {
                    const newMessage = {
                        id: `${Date.now()}_${Math.random()}`,
                        message: text.trim(),
                        isUser: true,
                        timestamp: new Date().toISOString()
                    };

                    setMessages(prev => [...prev, newMessage]);
                    setInput('');

                    // Força scroll para baixo
                    setTimeout(() => {
                        scrollToBottom();
                    }, 50);

                    setIsTyping(true);
                    console.log('🔄 Iniciando requisição para IA...');

                    // Chama a API
                    sendMessageToAPI(newMessage.message);
                }
            }, 100);
        }
    }, [scrollToBottom, sendMessageToAPI]);

    // Auto-scroll para a última mensagem
    useEffect(() => {
        if (flatListRef.current && messages.length > 0) {
            const timer = setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [messages]);

    // Auto-scroll quando o typing indicator aparece/desaparece
    useEffect(() => {
        if (flatListRef.current && isTyping) {
            const timer = setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [isTyping]);

    const renderMessage = useCallback(({ item, index }) => (
        <MessageBubble 
            message={item.message} 
            isUser={item.isUser} 
            index={index}
        />
    ), []);

    const keyExtractor = useCallback((item) => item.id, []);

    // Componente para quando não há mensagens
    const ListEmptyComponent = useCallback(() => (
        <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={64} color="#C7C7CC" />
            <Text style={styles.emptyText}>Nenhuma mensagem ainda</Text>
            <Text style={styles.emptySubText}>
                Use os exemplos acima ou digite sua pergunta
            </Text>
        </View>
    ), []);

    const handleOpenSuggestions = useCallback(() => {
        setShowSuggestions(true);
    }, []);
    const handleCloseSuggestions = useCallback(() => {
        setShowSuggestions(false);
    }, []);
    const handleSuggestionSelect = useCallback((text) => {
        setInput(text);
        setShowSuggestions(false);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <KeyboardAvoidingView 
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : TAB_BAR_HEIGHT + 20}
            >
                {/* Sugestões de perguntas - movidas para cima */}
                {messages.length === 0 && (
                    <QuestionExamples onQuestionPress={handleQuestionPress} />
                )}

                {/* Lista de mensagens */}
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={keyExtractor}
                    style={styles.messagesList}
                    contentContainerStyle={[
                        styles.messagesContainer,
                        { paddingBottom: keyboardVisible ? TAB_BAR_HEIGHT + 140 : TAB_BAR_HEIGHT + 100 }
                    ]}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={scrollToBottom}
                    onLayout={scrollToBottom}
                    ListEmptyComponent={ListEmptyComponent}
                />

                {/* Indicador de digitação */}
                <TypingIndicator visible={isTyping} />

                {/* Área de input */}
                <View style={[
                    styles.inputContainer,
                    { 
                        paddingBottom: keyboardVisible ? TAB_BAR_HEIGHT + 50 : Platform.OS === 'ios' ? 50 : 46,
                        position: 'relative',
                        zIndex: 1000
                    }
                ]}>
                    <CustomMessageCamp
                        value={input}
                        onChangeText={setInput}
                        onSend={handleSend}
                        onOpenSuggestions={handleOpenSuggestions}
                        placeholder="Digite sua pergunta..."
                        isTyping={isTyping}
                    />
                </View>

                {/* Modal de sugestões de perguntas */}
                <Modal
                    visible={showSuggestions}
                    transparent
                    animationType="fade"
                    onRequestClose={handleCloseSuggestions}
                >
                    <TouchableWithoutFeedback onPress={handleCloseSuggestions}>
                        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-end' }}>
                            <TouchableWithoutFeedback>
                                <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: 20, maxHeight: 350 }}>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#2E8331' }}>Sugestões de Perguntas</Text>
                                    <ScrollView>
                                        {nutritionSuggestions.map((s, idx) => (
                                            <TouchableOpacity key={idx} style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' }} onPress={() => handleSuggestionSelect(s)}>
                                                <Text style={{ fontSize: 16, color: '#1C1C1E' }}>{s}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </KeyboardAvoidingView>

            {/* Modal de confirmação para excluir */}
            <DeleteConfirmationModal
                visible={showDeleteModal}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    messagesList: {
        flex: 1,
    },
    messagesContainer: {
        paddingVertical: 20,
        paddingHorizontal: 16,
        paddingBottom: TAB_BAR_HEIGHT + 100,
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
    },
    inputContainer: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E5EA',
        paddingHorizontal: 16,
        paddingVertical: 8,
        paddingBottom: Platform.OS === 'ios' ? 20 : 16,
    },
    typingContainer: {
        paddingHorizontal: 16,
        paddingBottom: 8,
        alignItems: 'flex-start',
    },
    typingBubble: {
        backgroundColor: '#F2F2F7',
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
    examplesContainer: {
        paddingHorizontal: 12,
        paddingVertical: 12,
        backgroundColor: '#F8F9FB',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
    },
    examplesTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1C1C1E',
        marginBottom: 10,
        textAlign: 'center',
    },
    examplesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 8,
    },
    exampleCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 8,
        marginBottom: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        minHeight: 80,
        alignItems: 'center',
        justifyContent: 'center',
        width: '48%',
    },
    exampleIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    exampleTitle: {
        fontSize: 11,
        fontWeight: '600',
        color: '#1C1C1E',
        marginBottom: 2,
        textAlign: 'center',
    },
    exampleDescription: {
        fontSize: 9,
        color: '#8E8E93',
        textAlign: 'center',
        lineHeight: 12,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        marginTop: SCREEN_HEIGHT * 0.1,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#8E8E93',
        marginTop: 16,
        textAlign: 'center',
    },
    emptySubText: {
        fontSize: 14,
        color: '#C7C7CC',
        marginTop: 8,
        textAlign: 'center',
        lineHeight: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        maxHeight: '80%',
        alignItems: 'center',
    },
    modalHeader: {
        alignItems: 'center',
        marginBottom: 20,
    },
    modalIconContainer: {
        backgroundColor: '#FF3B30',
        borderRadius: 16,
        padding: 8,
        marginBottom: 12,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1C1C1E',
    },
    modalMessage: {
        fontSize: 14,
        fontWeight: '400',
        color: '#1C1C1E',
        textAlign: 'center',
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#F2F2F7',
        flex: 1,
        marginHorizontal: 4,
    },
    cancelButton: {
        backgroundColor: '#C7C7CC',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    confirmButton: {
        backgroundColor: '#FF3B30',
    },
    confirmButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center',
    },
});