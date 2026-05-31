const db = require("../databases/db");
const hoje = new Date().getTimezoneOffset();

const registerPrato = async function (
  id_restaurante,
  nome,
  descricao,
  preco,
  categoria,
  imagem,
) {
  const query = `INSERT INTO pratos (id_restaurante, nome, descricao, preco, categoria, imagem) 
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
  try {
    const result = await db.query(query, [
      id_restaurante,
      nome,
      descricao,
      preco,
      categoria,
      imagem,
    ]);

    result.rows[0];
  } catch (error) {
    throw error;
  }
};

const mandarParaHistorico = async function (no_menu, created_at, id_pato) {
  const query = `IF created_at != ${hoje} UPDATE pratos SET no_menu = FALSE`;

  try {
    const result = await db.query(query, [no_menu, created_at, id_pato]);
    result.rowCount;
  } catch (error) {
    throw error;
  }
};

const osDohistorico = async function (no_menu) {
  const query = `SELECT imagem, nome, created_at FROM pratos WHERE no_menu = FALSE`;
  try {
    const result = await db.query(query, [no_menu]);
    result.rows[0];
  } catch (error) {
    throw error;
  }
};

const republicarDoHistorico = async function (no_menu, created_at, id_prato) {
  const query = `UPDATE pratos SET no_menu = TRUE, created_at = ${hoje} WHERE id_prato = $3`;
  try {
    const result = await db.query(query, [no_menu, created_at, id_prato]);
    result.rowCount;
  } catch (error) {
    throw error;
  }
};

const deletarDoHistorico = async function (id_pato) {
  const query = `DELETE * FROM pratos WHERE id_pratos = $1`;
  try {
    const result = await db.query(query, [id_pato]);
    result.rowCount;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  registerPrato,
  mandarParaHistorico,
  republicarDoHistorico,
  osDohistorico,
  deletarDoHistorico,
};
