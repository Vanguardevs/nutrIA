import { useNavigation } from "@react-navigation/native";
import { Text, View, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, Image, Button, ImageBackground,} from "react-native";
import {useState} from 'react'
import {TextInput } from "react-native-paper";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GiftedChat } from "react-native-gifted-chat";


export default function Home() {

    const navigation = useNavigation();

    const [messages, setMessages] = useState([]);
    const [InputMessage, setInputMessage] = useState("")            /* CRIANDO O MOLDADOR DA MENSAGEM, E RECEBENDO QUAL A MENSAGEM */
    const [outputMessage, setOutputMessage] = useState("Resultados aqui")  

    const enviarMensagem = async() => {

        const message = {                                           /* CRIANDO OBJETO: MENSAGEM */
            _id:Math.random().toString(36).substring(7),            /*Cada mensagem vai ter seu próprio id, para não aparecer mensagens que ja apareceram na tela. */
            text:InputMessage,                                      /* Texto dentro da mensagem */
            createdAt:new Date(),                                   /*Mostrando o tempo da mensagem*/
            user: {_id:1}                                           /* Diferenciar mensagem da resposta */
        }
    
        setMessages((previousMessages)=>                           /* MONSTRANDO OBJETO: MENSAGEM NO CHAT DA TELA */
            GiftedChat.append(previousMessages,[message])
    )

        const gemini = new GoogleGenerativeAI("AIzaSyC-9oOoUxE0v13DNuE37qBzClAfhJrxRJs");
        const model = await gemini.getGenerativeModel({model:"gemini-1.5-flash"});
        const result = await model.generateContent(InputMessage);                          
        console.log(result.response.text());
        setOutputMessage(result.response.text);

        const messageR = {                                           /* CRIANDO OBJETO: MENSAGEM */
            _id:Math.random().toString(36).substring(7),            /*Cada mensagem vai ter seu próprio id, para não aparecer mensagens que ja apareceram na tela. */
            text: result.response.text(),                                      /* Texto dentro da mensagem */
            createdAt:new Date(),                                   /*Mostrando o tempo da mensagem*/
            user: {_id:2, name: "Nutria"}                             /* Diferenciar mensagem da resposta e pergunta (nomes também)*/
        }
    
        setMessages((previousMessages)=>                           /* MONSTRANDO OBJETO: MENSAGEM NO CHAT DA TELA */
            GiftedChat.append(previousMessages,[messageR])
    )
    }

 
    const receberMensagem = async(text) => {
        await setInputMessage(text);
    }
    




    //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
    return(
        <SafeAreaView style={styles.homeContainer}>
        <ImageBackground
            source={require('../../../assets/Frutas_home.png')}
            style={styles.homeBackground}>


        <View style={styles.homeHeader}>          {/*   HEADER   */}
        </View>

        <View style={styles.homeMid}>               {/*   MID?   */}
            
            {/* <Text>{outputMessage}</Text> */}
            <GiftedChat messages={messages} renderInputToolbar={() => {}} user={{_id:1}}> </GiftedChat>

        </View>

        <View style={styles.homeFooter}>        {/*      FOOTER    */}
            <View style={styles.homeText}>
            <TextInput placeholder="Mande sua pergunta" onChangeText={receberMensagem}/>
            </View>

                <TouchableOpacity onPress={enviarMensagem}>
                    <View>
                    <Image source={require('../../../assets/homeButton.png')} style= {styles.homeImage}/>
                    </View>
                </TouchableOpacity>
        </View>


        </ImageBackground>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    homeContainer:{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    homeBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 800,
        width: 400,
    },
    homeImage: {
        height: 55,
        width: 55,
        flex: 1,
        marginLeft: 10,
        marginRight: 30,
    },
    homeFooter: {
        flexDirection: "row",
        width: 400,
        marginLeft: 30,

    },
    homeHeader: {
        flex: 1,
    },
    homeText: {
        flex: 1,
        marginLeft: 0,
        borderRadius: 300,
        borderCurve: 9000,
    },
    homeMid: {
        flex: 1,
        justifyContent: "center",
    },
})
