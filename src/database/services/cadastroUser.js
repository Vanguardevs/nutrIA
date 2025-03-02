import pg from "pg";

const {Client} = pg;

const cliente = new Client({
    user: "postgre",
    password: "admin",
    host: "localhost",
    database: "nutria",
    port: 5432
})

cliente.connect()

async function CadastroUser(){
    try{
        const response = await cliente.query("insert into tbl_usuario values (?,?,?,?,?,?)")
        console.log("Insert na tabela de usuário feito com sucesso!")
    }catch(error){
        console.log("Erro: " + error)
    }
}


export default {CadastroUser}