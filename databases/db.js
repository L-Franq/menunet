require("dotenv").config();
const { Pool }  = require("pg");

const db = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

db.connect((error, cliente, release) =>{
    if(error) return console.log("Falha ao se conectar: ", error.stack);
   console.log("Conexao bem sucedida!");
   release();
})

module.exports = db;