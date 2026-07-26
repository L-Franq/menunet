const db = require("../databases/db");

const verificarEmail = async function (email) {
  const sql = `SELECT 1 FROM restaurantes WHERE email = $1`;
  try {
    const result = await db.query(sql, [email]);
    return result.rows.length > 0;
  } catch (error) {
    throw error;
  }
};

const registrar = async function (nome, email, senha, slug) {
  const sql = `INSERT INTO restaurantes (nome, email, senha, slug) VALUES($1, $2, $3, $4) RETURNING *`;
  try {
    const result = await db.query(sql, [nome, email, senha, slug]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

const login = async function (email) {
  const sql = `SELECT id_restaurante, nome, slug, email, senha  FROM restaurantes WHERE email = $1`;
  try {
    const result = await db.query(sql, [email]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

const buscarDadosRestaurantes = async function(id){
  const sql = `SELECT * FROM restaurantes WHERE id_restaurante = $1`;
  try {
    const result = await db.query(sql, [id]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

module.exports = { verificarEmail, registrar, login, buscarDadosRestaurantes };
