const db = require("../databases/db");

const atualizarDadosRestaurante = async function (
  nome,
  email,
  slug,
  id,
) {
  const query = `UPDATE restaurantes SET nome = $1, email = $2, slug = $3 WHERE id_restaurante = $4`;

  try {
    const result = await db.query(query, [nome, email, slug, id]);
    return result.rowCount;
  } catch (error) {
    throw error;
  }
};

const atualizarSenha = async function(senha, id) {
    const query = `UPDATE restaurantes SET senha = $1 WHERE id_restaurante = $2`;
    try {
        const result = await db.query(query, [senha, id]);
        return result.rowCount;
    } catch (error) {
        throw error;
    }
}

module.exports = {atualizarDadosRestaurante, atualizarSenha };
