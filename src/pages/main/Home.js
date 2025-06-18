import { useNavigation } from "@react-navigation/native";
import { useColorScheme, Text, View, StyleSheet, TouchableOpacity, SafeAreaView, Image, ImageBackground, KeyboardAvoidingView, Platform, StatusBar, Dimensions, Keyboard } from "react-native";
import { useState, useEffect, useCallback, useRef } from 'react';
import axios from "axios";
import {TextInput} from "react-native-paper";
import { GoogleGenerativeAI } from "@google/generative-ai";
import CustomMessageCamp from "../../components/CustomMessageCamp";
import { auth } from "../../database/firebase";
import { GiftedChat } from "react-native-gifted-chat";

export default function Home() {
    const colorScheme = useColorScheme();
    const background = colorScheme === 'dark'? "#1C1C1E" : "#F2F2F2";
    const navigation = useNavigation();
    const [messages, setMessages] = useState([]);
    const [InputMessage, setInputMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    
    // Definindo altura da tabBar
    const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 90 : 70;

    useEffect(() => {
        // Carregar mensagens salvas ao montar o componente
        loadInitialMessages();
        
        // Listeners para o teclado
        const keyboardWillShow = (event) => {
            setKeyboardHeight(event.endCoordinates.height);
        };
        
        const keyboardWillHide = () => {
            setKeyboardHeight(0);
        };

        const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
        const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
        
        const keyboardDidShowListener = Keyboard.addListener(showEvent, keyboardWillShow);
        const keyboardDidHideListener = Keyboard.addListener(hideEvent, keyboardWillHide);
        
        async function ligarRender(){
            try {
                const resp = await axios.get("https://nutria-6uny.onrender.com/on");
                return resp.data;
            } catch (error) {
                console.error("Erro ao conectar com o servidor:", error);
            }
        }
        ligarRender();

        return () => {
            keyboardDidShowListener?.remove();
            keyboardDidHideListener?.remove();
        };
    }, []);

    const loadInitialMessages = useCallback(() => {
        // Aqui você pode carregar mensagens do storage local se necessário
        setMessages([]);
    }, []);

    const onSend = useCallback(async (newMessage) => {
        if (!newMessage || isLoading) return;
        
        setIsLoading(true);
        try {
            // Adiciona a mensagem do usuário
            const userMessage = {
                _id: Math.random().toString(36).substring(7),
                text: newMessage,
                createdAt: new Date(),
                user: { _id: 1 }
            };

            setMessages(previousMessages => 
                GiftedChat.append(previousMessages, [userMessage])
            );

            const userID = auth.currentUser?.uid;
            const response = await axios.post("https://nutria-6uny.onrender.com/question", {
                "pergunta": newMessage,
                "id_user": userID
            });

            // Adiciona a resposta do assistente
            const assistantMessage = {
                _id: Math.random().toString(36).substring(7),
                text: response.data.message.resposta,
                createdAt: new Date(),
                user: { _id: 2, name: "Nutria" }
            };

            setMessages(previousMessages => 
                GiftedChat.append(previousMessages, [assistantMessage])
            );

        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading]);

    const enviarMensagem = async () => {
        if (InputMessage.trim()) {
            await onSend(InputMessage.trim());
            setInputMessage("");
        }
    };

    return(
        <SafeAreaView style={[styles.homeContainer,{backgroundColor: background}]}> 
            <ImageBackground
                resizeMode="cover"
                source={require('../../../assets/Frutas_home.png')}
                style={styles.homeBackground}
            >
                <View style={styles.contentContainer}>
                    <View style={[
                        styles.messagesWrapper,
                        {
                            paddingBottom: keyboardHeight > 0 ? 120 : 60,
                        }
                    ]}>
                        <GiftedChat 
                            messages={messages} 
                            renderInputToolbar={() => null} 
                            user={{_id:1}}
                            listViewProps={{
                                contentContainerStyle: [
                                    styles.chatContentContainer,
                                    {
                                        paddingBottom: keyboardHeight > 0 ? 20 : 10,
                                    }
                                ],
                                keyboardShouldPersistTaps: 'handled',
                                style: { flex: 1 }
                            }}
                            minInputToolbarHeight={0}
                            inverted={true}
                            extraData={{ keyboardHeight }}
                        />
                    </View>
                    
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
                        style={[
                            styles.inputContainer,
                            {
                                bottom: keyboardHeight > 0 ? keyboardHeight + 10 : TAB_BAR_HEIGHT,
                            }
                        ]}
                    >
                        <CustomMessageCamp 
                            placeholder="Mande sua pergunta" 
                            message={InputMessage} 
                            setMessage={setInputMessage} 
                            onSend={enviarMensagem}
                        />
                    </KeyboardAvoidingView>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    homeContainer: {
        flex: 1,
    },
    homeBackground: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        position: 'relative',
    },
    messagesWrapper: {
        flex: 1,
        paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0,
    },
    chatContentContainer: {
        flexGrow: 1,
        paddingHorizontal: 10,
        paddingVertical: 10,
        justifyContent: 'flex-end',
    },
    inputContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
        paddingHorizontal: 16, // aumentado
        paddingVertical: 16, // novo espaçamento vertical
        zIndex: 1000,
    },
});