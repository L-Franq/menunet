const db = require("../databases/db");

const registerPrato = async function (
  id_restaurante,
  nome,
  descricao,
  preco,
  categoria,
  imagem,
) {
  const sql = `INSERT INTO pratos (id_restaurante, nome, descricao, preco, categoria, imagem) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
  try {
    const result = await db.query(sql, [
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

const mostrarMenuPorSlug = async function (slug) {
  const sql = `SELECT p.id_prato, p.nome, p.preco, p.imagem, p.categoria,
   r.nome AS nome_restaurante FROM pratos p JOIN restaurantes r ON 
   p.id_restaurante = r.id_restaurante WHERE r.slug = $1 AND p.no_menu = TRUE`;
  try {
    const result = await db.query(sql, [
      slug
    ]);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

const mostrarNoHistorico = async function (id_restaurante) {
  const sql = `SELECT p.id_prato, p.nome, p.imagem, p.created_at,
   r.nome AS nome_restaurante FROM pratos p JOIN restaurantes r ON 
   p.id_restaurante = r.id_restaurante WHERE r.id_restaurante = $1 AND p.no_menu = FALSE`;
  try {
    const result = await db.query(sql, [
      id_restaurante
    ]);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

const republicarDoHistorico = async function (id_prato) {
  const sql = `UPDATE pratos SET no_menu = TRUE, created_at = NOW() WHERE id_prato = $1`;
  try {
    const result = await db.query(sql, [id_prato]);
    return result.rowCount;
  } catch (error) {
    throw error;
  }
};

const deletarDoHistorico = async function (id_pato) {
  const sql = `DELETE FROM pratos WHERE id_prato = $1`;
  try {
    const result = await db.query(sql, [id_pato]);
    return result.rowCount;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  registerPrato,
  republicarDoHistorico,
  deletarDoHistorico,
  mostrarMenuPorSlug,
  mostrarNoHistorico
};
