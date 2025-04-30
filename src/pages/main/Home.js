import { useNavigation } from "@react-navigation/native";
import { Text, View, StyleSheet, TouchableOpacity, SafeAreaView, Image, ImageBackground} from "react-native";
import {useState} from 'react';
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import {TextInput} from "react-native-paper";
import { GoogleGenerativeAI } from "@google/generative-ai";
import CustomMessageCamp from "../../components/CustomMessageCamp";
// import { GiftedChat } from "react-native-gifted-chat";


export default function Home() {
    
    const navigation = useNavigation();
    
    const [messages, setMessages] = useState([]);
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
    //     GiftedChat.append(previousMessages,[message])
    // )

    // const response = await axios.post("https://nutria-6uny.onrender.com/question", {"pergunta":InputMessage}); 
    // console.log(response.data.message.resposta);   /* ENVIANDO MENSAGEM PARA O BACKEND NUTRIA */
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
    // setInputMessage("");
    // }
    




    //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
    return(
        <SafeAreaView style={styles.homeContainer}>
            <ImageBackground
                source={require('../../../assets/Frutas_home.png')}
                style={styles.homeBackground}>

                <View style={styles.homeMid}>
                    
                    {/* <GiftedChat messages={messages} renderInputToolbar={() => null} user={{_id:1}}> </GiftedChat> */}

                </View>


            <View style={{flexDirection: "row", width: '100%', justifyContent: "space-between", alignItems: "center"}}>
                <CustomMessageCamp placeholder="Mande sua pergunta" message={InputMessage} setMessage={setInputMessage}/>
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
        alignItems: 'center',
        height: '100%',
        width: '100%'
    },
    homeBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
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
        width: '100%',
        justifyContent: "center",
    },
})
