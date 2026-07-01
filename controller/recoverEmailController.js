const modelRestaurante = require("../model/restauranteModel");

const recoveryEmailVerif = async (req, res) => {
  const { email } = req.body;
  try {
    const emailOnSystem = await modelRestaurante.verificarEmail(email);

    if (!emailOnSystem) {
      return res.status(404).json({ erro: "Email não encontrado!" });
    }
    return res.status(200).json({ mensagem: "Avançando..." });
  } catch (error) {
    return res
      .status(500)
      .json({ erro: "Falha na conexão. Tente mais tarde!" });
  }
};

module.exports = { recoveryEmailVerif };
