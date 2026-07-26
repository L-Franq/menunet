const db = require("../databases/db");

const registrarToken = async (id_restaurante, token, expiracao) => {
  const sql = `INSERT INTO tokenst (id_restaurante, token, expiracao) VALUES ($1, $2, $3) RETURNING *`;
  try {
    const result = await db.query(sql, [id_restaurante, token, expiracao]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

const buscarToken = async (token) => {
  const sql = `SELECT * FROM tokenst WHERE token = $1`;
  try {
    const result = await db.query(sql, [token]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

const eliminarToken = async (token) =>{
  const sql = `DELETE FROM tokenst WHERE token = $1`;
  try {
    const result = await db.query(sql, [token]);
    result.rowCount;
  } catch (error) {
    throw error;
  }
}

module.exports = { registrarToken, buscarToken, eliminarToken };
