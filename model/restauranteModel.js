const db = require("../databases/db");

const verificarEmail = async function (email) {
  const query = `SELECT 1 FROM restaurantes WHERE email = $1`;
  try {
    const result = await db.query(query, [email]);
    return result.rows > 0;
  } catch (error) {
    throw error;
  }
};

const registrar = async function (nome, slag, email, senha) {
  const query = `INSERT INTO restaurantes VALUES($1, $2, $3, $4) RETURNING *`;
  try {
    const result = await db.query(query, [nome, slag, email, senha]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

const login = async function (email) {
  const query = `SELECT id_restaurantes, slug, email, senha  FROM restaurantes WHERE email = $1`;
  try {
    const result = await db.query(query, [email]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

module.exports = { verificarEmail, registrar, login };
