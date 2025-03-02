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

async function CadastroUser(nome, email, senha, idade, sexo, type_user){
    try{
        await cliente.query(`insert into usuarios values (${nome}, ${email}, ${senha}, ${idade}, ${sexo}, ${type_user})`)
        console.log("Insert na tabela de usuário feito com sucesso!")
    }catch(error){
        console.log("Erro: " + error)
    }
}

async function CadastroHiSaude(peso_n, gordura_corporal, massa_musc, taxa_metabo, ingestao_calorica_di, ){
    try{
        await cliente.query(`insert into historico_saude values (${peso_n}, ${gordura_corporal}, ${massa_musc}, ${taxa_metabo}, ${ingestao_calorica_di})`)
        console.log("Insert na tabela de histórico de saude do usuário feito com sucesso!");
    }catch(errror){
        console.log("Erro: " + errror)
    }
}

export default {CadastroUser}