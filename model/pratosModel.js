const db = require("../databases/db");
const hoje = new Date(); 

const registerPrato = async function (
  id_restaurante,
  nome,
  descricao,
  preco,
  categoria,
  imagem,
) {
  const query = `INSERT INTO pratos (id_restaurante, nome, descricao, preco, categoria, imagem) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
  try {
    const result = await db.query(query, [
      id_restaurante,
      nome,
      descricao,
      preco,
      categoria,
      imagem,
    ]);

    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

const mostrarMenu = async function (
  id_restaurante,
  id_prato,
  nome,
  preco,
  imagem,
) {
  const query =
    "SELECT id_prato, nome, preco, imagem, id_restaurante From pratos WHERE id_restaurante = $1";
  try {
    const result = await db.query(query, [
      id_restaurante,
      id_prato,
      nome,
      preco,
      imagem,
    ]);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

const republicarDoHistorico = async function (no_menu, created_at, id_prato) {
  const query = `UPDATE pratos SET no_menu = TRUE, created_at = ${hoje} WHERE id_prato = $3`;
  try {
    const result = await db.query(query, [no_menu, created_at, id_prato]);
    return result.rowCount;
  } catch (error) {
    throw error;
  }
};

const deletarDoHistorico = async function (id_pato) {
  const query = `DELETE * FROM pratos WHERE id_pratos = $1`;
  try {
    const result = await db.query(query, [id_pato]);
    return result.rowCount;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  registerPrato,
  republicarDoHistorico,
  deletarDoHistorico,
  mostrarMenu,
};
