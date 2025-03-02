import pg from "pg";

const {Client} = pg

const cliente = new Client({
    user: "postgre",
    password: "admin",
    host: "localhost",
    database: "nutria",
    port: 5432
})

cliente.connect()

async function verCliente(email, senha){
    try{
        await cliente.query(`select * from usuarios where email = ${email} and senha = ${senha}`, (err,res)=>{
            return res.rows
        })
    }catch(Error){
        console.log("erro: " + Error)
    }
}

export default {verCliente}