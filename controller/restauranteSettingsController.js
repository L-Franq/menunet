const { zodError } = require("zod");
const { updateSchema } = require("../schemas/updateSchema");
const tokenModel = require("../model/tokenModel");
const atualizarDados = require("../model/atulizarRestauranteModel");
const bcrypt = require("bcrypt");

const update = async function (req, res) {
  try {
    const data = updateSchema.parse(req.body);

    const valoresAtualizados = atualizarDados.atualizarDadosRestaurante(
      data.nome,
      data.email,
      data.slug,
      req.id_restaurante,
    );

    if (valoresAtualizados == null) {
      return;
    }

    return res.status(200).json({
      mensagem: "Informações atualizadas com sucesso",
      restaurante: req.id_restaurante,
    });
  } catch (error) {
    if (error instanceof zodError) {
      return res
        .status(400)
        .json({ error: error.errors[0]?.message || "Dados inválidos!" });
    }
    console.error("Falha error: ", error);
    return res.status(500).json({ error: "Falha catch: ", error });
  }
};

const UpdateSenha = async function (req, res) {
  try {
    const { token, senha } = req.body;

    const tokenUrl = await tokenModel.buscarToken(token);

    if(!tokenUrl){
      return res.status(400).json({erro: "Link de verificação inválido ou expirado!"});
    }

    const id_restaurante = tokenUrl.id_restaurante;
    const senhaHashed = await bcrypt.hash(senha, 10);
    console.log(id_restaurante);

    const linhasAfetadas = await atualizarDados.atualizarSenha(
      senhaHashed,
      id_restaurante,
    );

    if (!linhasAfetadas || linhasAfetadas === 0) {
      return res.status(400).json({ erro: "Falha ao atualizar." });
    }

    return res.status(200).json({
      mensagem: "Senha atualizada com sucesso!",
    });
  } catch (error) {
    console.error("Falha catch: ", error);
    return res
      .status(500)
      .json({ erro: "Falha no servidor! Tente mais tarde." });
  }
};

module.exports = { update, UpdateSenha };
