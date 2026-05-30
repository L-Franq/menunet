const db = require("../databases/db");

const verificarEmail = async function (email) {
  const query = `SELECT 1 FROM restaurantes WHERE email = $1`;
  try {
    const result = await db.query(query, [email]);
    return result.rows.length > 0;
  } catch (error) {
    throw error;
  }
};

const registrar = async function (nome, email, senha, slug) {
  const query = `INSERT INTO restaurantes (nome, email, senha, slug) VALUES($1, $2, $3, $4) RETURNING *`;
  try {
    const result = await db.query(query, [nome, email, senha, slug]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

const login = async function (email) {
  const query = `SELECT id_restaurante, nome, slug, email, senha  FROM restaurantes WHERE email = $1`;
  try {
    const result = await db.query(query, [email]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

const dados = async function(id){
  const query = `SELECT * FROM restaurantes WHERE id_restaurante = $1`;
  try {
    const result = await db.query(query, [id]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

module.exports = { verificarEmail, registrar, login, dados };
