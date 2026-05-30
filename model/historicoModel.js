const db = require("../databases/db");

const dadosHistorico = async function () {
  const query = `SELECT id_prato, id_restaurante, nome, created_at`;

  try {
    const result = await db.query(query);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

module.exports = { dadosHistorico };
