import { useNavigation } from "@react-navigation/native";
import { useColorScheme, Text, View, StyleSheet, TouchableOpacity, SafeAreaView, Image, ImageBackground, KeyboardAvoidingView, Platform} from "react-native"; // Adicionado KeyboardAvoidingView, Platform
import { useState } from 'react';
import axios from "axios";
import {TextInput} from "react-native-paper";
import { GoogleGenerativeAI } from "@google/generative-ai";
import CustomMessageCamp from "../../components/CustomMessageCamp";
import { auth } from "../../database/firebase";
// import { GiftedChat } from "react-native-gifted-chat";


export default function Home() {

    const colorScheme = useColorScheme();
    
    const background = colorScheme === 'dark'? "#1C1C1E" : "#F2F2F2";
    
    const navigation = useNavigation();
    
    const [messages, setMessages] = useState([]);
    // Calcula a altura aproximada da área da Tab Bar (altura + margem + buffer)
    // 8% (altura) + 2% (margem) + 2% (buffer) = 12%
    // Ou use um valor fixo em pixels se preferir, ex: 90
    const tabBarAreaHeight = 90; // Ajuste este valor conforme necessário
    const [InputMessage, setInputMessage] = useState("")            
    const [outputMessage, setOutputMessage] = useState("Resultados aqui")  
    
    // const enviarMensagem = async() => {
        
    //     const message = {                                          
    //         _id:Math.random().toString(36).substring(7),            
    //         text:InputMessage,                                    
    //         createdAt:new Date(),                                 
    //         user: {_id:1}                                           
    //     }
        
        
    //     setMessages((previousMessages)=>                          
    //         GiftedChat.append(previousMessages,[message])
    // )

    // setInputMessage("");

    // const userID = auth.currentUser?.uid

    // const response = await axios.post("https://nutria-6uny.onrender.com/question", {"pergunta":InputMessage, "id_user": userID}); 
    // console.log(response.data.message);   /* ENVIANDO MENSAGEM PARA O BACKEND NUTRIA */
    // setOutputMessage(response.data.message.resposta);
    
    // // const gemini = new GoogleGenerativeAI("AIzaSyC-9oOoUxE0v13DNuE37qBzClAfhJrxRJs");
    // // const model = await gemini.getGenerativeModel({model:"gemini-1.5-flash"});
    // // const result = await model.generateContent(InputMessage);                          
    // // console.log(result.response.text());
    // // setOutputMessage(result.response.text);
    
    // //Criando uma requisição post no back end nutria

    //     const messageR = {                                                       
    //         _id:Math.random().toString(36).substring(7),                         
    //         text: response.data.message.resposta,                                         
    //         createdAt:new Date(),                                                 
    //         user: {_id:2, name: "Nutria"}                                      
    //     }
    
    //     setMessages((previousMessages)=>                           
    //         GiftedChat.append(previousMessages,[messageR])
    // )
    // }
    




    //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
    return(
        <SafeAreaView style={[styles.homeContainer,{backgroundColor: background}]}>
            <ImageBackground
                resizeMode="cover" // Garante que a imagem cubra a área
                source={require('../../../assets/Frutas_home.png')}
                style={styles.homeBackground}>

                    
                    <KeyboardAvoidingView 
                        behavior={Platform.OS === "ios" ? "padding" : "height"} 
                        style={[styles.keyboardAvoidingContainer, { paddingBottom: tabBarAreaHeight }]}
                    >
                        <View style={styles.homeMid}>
                            
                            {/* <GiftedChat messages={messages} renderInputToolbar={() => null} user={{_id:1}}> </GiftedChat> */}

                        </View>

                        <CustomMessageCamp placeholder="Mande sua pergunta" message={InputMessage} setMessage={setInputMessage} onSend={async() => await enviarMensagem()}/>            
                    </KeyboardAvoidingView>

            </ImageBackground>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    homeContainer:{
        flex: 1,
    },
    homeBackground: {
        flex: 1,
        height: '100%',
        width: '100%',
    },
    keyboardAvoidingContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-end',
    },
    contentWrapper: {
        flex: 1,
    },
    homeImage: {
        height: 30,
        width: 49,
        marginLeft: 10,
    },
    homeFooter: {
        flexDirection: "row",
        width: '100%',
    },
    homeText: {
        flex: 1,
        marginLeft: 0,
        borderRadius: 300,
        borderCurve: 9000,
    },
    homeMid: {
        flex: 1,
        height: '100%',
        width: '100%', // Ocupa a largura
        justifyContent: "center",
    },
})
