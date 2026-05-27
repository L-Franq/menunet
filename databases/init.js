const db = require("./db");

const tabelas = [
  `CREATE TABLE IF NOT EXISTS restaurantes (
    id_restaurante SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE,
    profile_pic VARCHAR(200) DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  );`,

  `CREATE TABLE IF NOT EXISTS pratos (
    id_prato SERIAL PRIMARY KEY,
    id_restaurante INTEGER REFERENCES restaurantes(id_restaurante) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2) NOT NULL,
    categoria VARCHAR(200) NOT NULL,
    imagem VARCHAR(200) DEFAULT '',
    no_menu BOOLEAN DEFAULT TRUE, -- TRUE = No Menu de Hoje | FALSE = Histórico
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  );`
];

async function criarTabelas() {
  for (const query of tabelas) {
    try {
      await db.query(query);
      console.log("Tabela processada com sucesso!");
    } catch (error) {
      console.error("Erro:", error.message);
    }
  }
}

criarTabelas();
module.exports = db;