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
    Alert
} from 'react-native';
import Voice from '@react-native-voice/voice';
import { Ionicons } from '@expo/vector-icons';
import CustomMessageCamp from "../../components/CustomMessageCamp";
import HeaderMapButton from "../../components/HeaderMapButton";
import axios from "axios";
import { auth } from "../../database/firebase";
import { cachedRequest } from "../../utils/apiCache";
import { API_URLS, API_CONFIG, getCurrentConfig } from "../../config/apiConfig";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const TAB_BAR_HEIGHT = Math.round(SCREEN_HEIGHT * 0.08); // 8% da tela, igual ao appRoute.js

// Componente animado para o balão de mensagem - otimizado com React.memo
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
        const delay = Math.min(index * 50, 200); // Limita o delay máximo

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                delay,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 250,
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

    const formattedTimestamp = useMemo(() => {
        if (!timestamp) return null;
        return new Date(timestamp).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }, [timestamp]);

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
                {formattedTimestamp && (
                    <Text style={{
                        color: isUser ? '#D0F5D8' : '#888',
                        fontSize: 11,
                        marginTop: 4,
                        textAlign: isUser ? 'right' : 'left',
                    }}>
                        {formattedTimestamp}
                    </Text>
                )}
            </Animated.View>
        </View>
    );
});

// Componente para indicador de digitação - otimizado
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

            // Animação dos pontos
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

// Componente para exemplos de perguntas - otimizado
const QuestionExamples = React.memo(({ onQuestionPress }) => {
    const { width: screenWidth } = Dimensions.get('window');
    const isSmallScreen = screenWidth < 350;
    const isMediumScreen = screenWidth >= 350 && screenWidth < 400;
    
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
                                width: isSmallScreen ? '100%' : isMediumScreen ? '49%' : '48%',
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

// Componente principal
export default function Home({ navigation }) {
    const [alimentos, setAlimentos] = useState([]);
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [isLoadingFoods, setIsLoadingFoods] = useState(false); // Mudou para false pois não carrega mais
    
    const flatListRef = useRef(null);
    const micPulseAnim = useRef(new Animated.Value(1)).current;
    const inputContainerAnim = useRef(new Animated.Value(0)).current;

    // Função para lidar com cliques nos exemplos de perguntas
    const handleExamplePress = useCallback((question) => {
        setInput(question);
        // Auto-enviar a pergunta após um pequeno delay
        setTimeout(() => {
            handleSend();
        }, 100);
    }, [handleSend]);

    // Função para enviar mensagem - simplificada para usar apenas o backend
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

        // Força scroll para baixo imediatamente após adicionar mensagem do usuário
        setTimeout(() => {
            scrollToBottom();
        }, 50);

        setIsTyping(true);
        console.log('🔄 Iniciando requisição para IA...');

        try {
            const userID = auth.currentUser?.uid;
            
            // Payload simplificado - apenas a pergunta e ID do usuário
            const payloadFinal = {
                "pergunta": newMessage.message,
                "id_user": userID,
            };

            const config = getCurrentConfig();
            console.log(`📤 Enviando pergunta para ${config.environment.toUpperCase()}:`, payloadFinal.pergunta);
            console.log(`📍 URL: ${API_URLS.QUESTION}`);
            console.log(`📱 Plataforma: ${config.platform}`);

            // Usar apenas axios para simplificar
            console.log('🔄 Fazendo requisição com axios...');
            const response = await axios.post(API_URLS.QUESTION, payloadFinal, {
                timeout: API_CONFIG.TIMEOUT,
                headers: API_CONFIG.HEADERS
            });

            console.log('📥 Resposta recebida:', response.status);
            console.log('📝 Dados da resposta:', response.data);

            // Verificar estrutura da resposta
            if (!response.data) {
                throw new Error('Resposta vazia do servidor');
            }

            if (!response.data.message) {
                console.log('⚠️ Estrutura inesperada - sem campo message');
                console.log('📋 Resposta completa:', JSON.stringify(response.data, null, 2));
                throw new Error('Estrutura de resposta inválida - sem campo message');
            }

            if (!response.data.message.resposta) {
                console.log('⚠️ Estrutura inesperada - sem campo resposta');
                console.log('📋 Estrutura message:', JSON.stringify(response.data.message, null, 2));
                throw new Error('Estrutura de resposta inválida - sem campo resposta');
            }

            let respostaLimpa = response.data.message.resposta;
            
            // Limpar formatação se necessário
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
            
            console.log('✅ Adicionando resposta ao chat...');
            setMessages(prev => [...prev, botResponse]);
            
            // Força scroll para baixo após adicionar resposta da IA
            setTimeout(() => {
                scrollToBottom();
            }, 100);
            
            console.log('✅ Requisição concluída com sucesso!');
            
        } catch (error) {
            console.error('❌ Erro ao enviar mensagem:', error);
            console.error('❌ Detalhes do erro:', {
                message: error.message,
                code: error.code,
                response: error.response?.data,
                status: error.response?.status
            });
            
            // Mensagem de erro mais específica baseada no ambiente
            const config = getCurrentConfig();
            let errorMessage = "Desculpe, houve um erro ao buscar a resposta.";
            
            if (error.code === 'ECONNABORTED') {
                errorMessage = "Tempo limite excedido. Tente novamente.";
            } else if (error.code === 'ECONNREFUSED') {
                errorMessage = "Erro ao conectar com o servidor. Verifique se o backend está rodando.";
            } else if (error.response?.status === 404) {
                errorMessage = "Endpoint não encontrado. Verifique a configuração do backend.";
            } else if (error.response?.status === 500) {
                errorMessage = "Erro interno do servidor. Tente novamente.";
            }
            
            const botResponse = {
                id: `bot_${Date.now()}_${Math.random()}`,
                message: errorMessage,
                isUser: false,
                timestamp: new Date().toISOString()
            };
            
            console.log('❌ Adicionando mensagem de erro ao chat...');
            setMessages(prev => [...prev, botResponse]);
            
            // Força scroll para baixo mesmo em caso de erro
            setTimeout(() => {
                scrollToBottom();
            }, 100);
        } finally {
            console.log('🔄 Finalizando requisição, desativando typing...');
            setIsTyping(false);
        }
    }, [input, scrollToBottom]);

    // Animação de pulso para o botão do microfone
    useEffect(() => {
        if (isListening) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(micPulseAnim, {
                        toValue: 1.2,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(micPulseAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    })
                ])
            ).start();
        } else {
            micPulseAnim.setValue(1);
        }
    }, [isListening, micPulseAnim]);

    // Monitorar teclado - otimizado
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            (e) => {
                setKeyboardHeight(e.endCoordinates.height);
                Animated.timing(inputContainerAnim, {
                    toValue: Platform.OS === 'ios' ? -e.endCoordinates.height + 34 : 0,
                    duration: 200,
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
                    duration: 200,
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
            console.log('🎤 Reconhecimento de voz iniciado');
            setIsListening(true);
        };

        const onSpeechEnd = () => {
            console.log('🎤 Reconhecimento de voz finalizado');
            setIsListening(false);
        };

        const onSpeechResults = (event) => {
            console.log('🎤 Resultados do reconhecimento:', event);
            if (event.value && event.value.length > 0) {
                const recognizedText = event.value[0];
                console.log('🎤 Texto reconhecido:', recognizedText);
                setInput(recognizedText);
            }
        };

        const onSpeechError = (error) => {
            console.error('🎤 Erro no reconhecimento de voz:', error);
            setIsListening(false);
            
            let errorMessage = 'Erro no reconhecimento de voz. Tente novamente.';
            
            if (error.error) {
                switch (error.error.code) {
                    case '7':
                        errorMessage = 'Não foi possível entender o áudio. Fale mais claramente.';
                        break;
                    case '1':
                        errorMessage = 'Permissão de microfone negada. Verifique as configurações.';
                        break;
                    case '2':
                        errorMessage = 'Rede indisponível. Verifique sua conexão.';
                        break;
                    case '3':
                        errorMessage = 'Serviço de reconhecimento indisponível.';
                        break;
                    case '4':
                        errorMessage = 'Áudio muito baixo. Fale mais alto.';
                        break;
                    case '5':
                        errorMessage = 'Áudio muito alto. Fale mais baixo.';
                        break;
                    case '6':
                        errorMessage = 'Tempo limite excedido. Tente novamente.';
                        break;
                    default:
                        errorMessage = `Erro: ${error.error.message || 'Erro desconhecido'}`;
                }
            }
            
            Alert.alert('Erro de Voz', errorMessage);
        };

        const onSpeechPartialResults = (event) => {
            console.log('🎤 Resultados parciais:', event);
            if (event.value && event.value.length > 0) {
                setInput(event.value[0]);
            }
        };

        const onSpeechVolumeChanged = (event) => {
            console.log('🎤 Volume alterado:', event.value);
        };

        // Configurar todos os listeners
        Voice.onSpeechStart = onSpeechStart;
        Voice.onSpeechEnd = onSpeechEnd;
        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechError = onSpeechError;
        Voice.onSpeechPartialResults = onSpeechPartialResults;
        Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;

        return () => {
            // Limpar todos os listeners
            Voice.onSpeechStart = null;
            Voice.onSpeechEnd = null;
            Voice.onSpeechResults = null;
            Voice.onSpeechError = null;
            Voice.onSpeechPartialResults = null;
            Voice.onSpeechVolumeChanged = null;
        };
    }, []);

    // Inicia o reconhecimento de voz
    const startListening = useCallback(async () => {
        try {
            console.log('🎤 Tentando iniciar reconhecimento de voz...');
            
            // Verificação mais robusta do Voice
            if (!Voice) {
                console.warn('🎤 Voice module não está disponível');
                Alert.alert('Erro', 'Reconhecimento de voz não está disponível neste dispositivo.');
                return;
            }

            // Verificar se os métodos existem
            if (typeof Voice.start !== 'function') {
                console.warn('🎤 Voice.start não está disponível');
                Alert.alert('Erro', 'Reconhecimento de voz não está disponível neste dispositivo.');
                return;
            }

            // Verificar se já está ouvindo
            if (isListening) {
                console.log('🎤 Já está ouvindo, parando primeiro...');
                await stopListening();
                return;
            }

            // Parar qualquer reconhecimento anterior de forma segura
            try {
                if (typeof Voice.stop === 'function') {
                    await Voice.stop();
                }
            } catch (e) {
                console.log('🎤 Nenhum reconhecimento anterior para parar');
            }

            // Limpar input anterior
            setInput('');
            
            console.log('🎤 Iniciando reconhecimento de voz...');
            setIsListening(true);
            
            // Tentar iniciar o reconhecimento com tratamento de erro específico
            try {
                await Voice.start('pt-BR');
                console.log('🎤 Reconhecimento iniciado com sucesso');
            } catch (voiceError) {
                console.error('🎤 Erro específico do Voice.start:', voiceError);
                
                // Verificar se é um erro específico do Expo Go
                if (voiceError.message && voiceError.message.includes('startSpeech')) {
                    Alert.alert(
                        'Reconhecimento de Voz', 
                        'O reconhecimento de voz pode não funcionar completamente no Expo Go. Tente usar o build nativo para melhor compatibilidade.'
                    );
                } else {
                    throw voiceError; // Re-throw para ser capturado pelo catch externo
                }
            }
            
        } catch (error) {
            console.error('🎤 Erro ao iniciar reconhecimento de voz:', error);
            setIsListening(false);
            
            let errorMessage = 'Não foi possível iniciar o reconhecimento de voz.';
            
            // Tratamento específico de erros
            if (error.message) {
                if (error.message.includes('permission')) {
                    errorMessage = 'Permissão de microfone necessária. Verifique as configurações do app.';
                } else if (error.message.includes('network')) {
                    errorMessage = 'Conexão de rede necessária para reconhecimento de voz.';
                } else if (error.message.includes('service')) {
                    errorMessage = 'Serviço de reconhecimento de voz indisponível.';
                } else if (error.message.includes('startSpeech')) {
                    errorMessage = 'Reconhecimento de voz não suportado no Expo Go. Use o build nativo.';
                } else if (error.message.includes('null')) {
                    errorMessage = 'Módulo de voz não inicializado. Reinicie o app.';
                }
            }
            
            Alert.alert('Erro de Voz', errorMessage);
        }
    }, [isListening, stopListening]);

    // Para o reconhecimento de voz
    const stopListening = useCallback(async () => {
        try {
            console.log('🎤 Parando reconhecimento de voz...');
            
            // Verificação mais robusta
            if (!Voice) {
                console.warn('🎤 Voice module não está disponível para parar');
                setIsListening(false);
                return;
            }
            
            if (typeof Voice.stop === 'function') {
                try {
                    await Voice.stop();
                    console.log('🎤 Reconhecimento parado com sucesso');
                } catch (stopError) {
                    console.warn('🎤 Erro ao parar reconhecimento:', stopError);
                    // Mesmo com erro, vamos parar o estado
                }
            } else {
                console.warn('🎤 Voice.stop não está disponível');
            }
            
            setIsListening(false);
        } catch (error) {
            console.error('🎤 Erro ao parar reconhecimento de voz:', error);
            setIsListening(false);
        }
    }, []);

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

    // Auto-scroll para a última mensagem - corrigido
    useEffect(() => {
        if (flatListRef.current && messages.length > 0) {
            const timer = setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100); // Aumentei o delay para garantir que a mensagem foi renderizada
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

    // Função para forçar scroll para o final
    const scrollToBottom = useCallback(() => {
        if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, []);

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
                    <HeaderMapButton onPress={() => navigation.navigate('Map')} />
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

    const ListEmptyComponent = useCallback(() => (
        <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={64} color="#C7C7CC" />
            <Text style={styles.emptyText}>Nenhuma mensagem ainda</Text>
            <Text style={styles.emptySubText}>
                Use os exemplos acima ou digite sua pergunta
            </Text>
        </View>
    ), []);

    // Adicione este useEffect para testar quando necessário
    useEffect(() => {
        // Descomente a linha abaixo para executar o teste
        // testNutritionalExtraction();
        
        // Teste de disponibilidade do Voice
        const testVoiceAvailability = () => {
            console.log('🎤 Testando disponibilidade do Voice...');
            console.log('🎤 Voice disponível:', !!Voice);
            console.log('🎤 Voice.start disponível:', typeof Voice?.start === 'function');
            console.log('🎤 Voice.stop disponível:', typeof Voice?.stop === 'function');
            
            if (Voice) {
                console.log('✅ Voice está disponível e funcional');
                
                // Verificar se estamos no Expo Go
                if (__DEV__) {
                    console.log('🎤 Executando em modo de desenvolvimento (Expo Go)');
                    console.log('🎤 Nota: Reconhecimento de voz pode ter limitações no Expo Go');
                }
            } else {
                console.warn('⚠️ Voice não está disponível');
            }
        };
        
        // Executar teste após 2 segundos
        setTimeout(testVoiceAvailability, 2000);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={TAB_BAR_HEIGHT}
            >
                <View style={styles.chatContainer}>
                    {/* Exemplos de perguntas - apenas quando não há mensagens */}
                    {messages.length === 0 && (
                        <QuestionExamples onQuestionPress={handleExamplePress} />
                    )}
                    
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        renderItem={renderMessage}
                        keyExtractor={keyExtractor}
                        contentContainerStyle={[
                            styles.messagesList,
                            {
                                paddingBottom: TAB_BAR_HEIGHT + 25,
                                minHeight: messages.length === 0 ? SCREEN_HEIGHT * 0.4 : undefined
                            }
                        ]}
                        showsVerticalScrollIndicator={false}
                        removeClippedSubviews={false} // Desabilitado para garantir scroll
                        maxToRenderPerBatch={10} // Aumentado para melhor performance
                        windowSize={10} // Aumentado para melhor performance
                        initialNumToRender={10}
                        onContentSizeChange={scrollToBottom} // Scroll automático quando conteúdo muda
                        onLayout={scrollToBottom} // Scroll quando layout muda
                        ListEmptyComponent={ListEmptyComponent}
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
                            marginBottom: TAB_BAR_HEIGHT + 15
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
                        isTyping={isTyping}
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
    },
    exampleIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
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
});