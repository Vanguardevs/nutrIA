import pg from "pg";
import { createUserWithEmailAndPassword } from "firebase/auth";
import database from "../firebase.js";

const {Client} = pg;

const cliente = new Client({
    user: "postgre",
    password: "admin",
    host: "localhost",
    database: "nutria",
    port: 5432
})

cliente.connect()

async function CadastroUser(nome, email, password, idade, sexo, type_user){
    try{
        await createUserWithEmailAndPassword(database.auth, email, password);
        await cliente.query(`insert into usuarios values (${nome}, ${email}, ${password}, ${idade}, ${sexo}, ${type_user})`)
        console.log("Insert na tabela de usuário feito com sucesso!")
    }catch(error){
        console.log("Erro: " + error)
    }
}

async function CadastroDadoSaude(peso, altura,imc,gordura_corp, massa_musc, objetivo, nivel_atividade, taxa_metabolica, injest_calor){
    try{
        await cliente.query(`insert into dados_saude values (${peso}, ${altura}, ${imc}, ${gordura_corp}, ${massa_musc}, ${objetivo}, ${nivel_atividade}, ${taxa_metabolica}, ${injest_calor})`)
        console.log("Insert na tabela de histórico de saude do usuário feito com sucesso!");
    }catch(errror){
        console.log("Erro: " + errror)
    }
}

export default {CadastroUser, CadastroDadoSaude}
