import database from '../config/firebase.js';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";


async function Login(email, password){
    try{
    await signInWithEmailAndPassword(database.auth, email, password);
    console.log("Sucesso ao fazer o login!");
    }catch(error){
        console.log(`O erro é: ${error}`)
        sucesso = 0;
}
}

export default {Login}