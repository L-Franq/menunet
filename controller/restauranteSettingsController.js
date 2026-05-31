const { zodError } = require("zod");
const { updateSchema } = require("../schemas/updateSchema");
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
      mensagem: "Informacoes atualizadas com sucesso",
      restaurante: req.id_restaurante,
    });
  } catch (error) {
    if (error instanceof zodError) {
      return res
        .status(400)
        .json({ error: error.erros?.errors[0]?.message || "Dados invalidos!" });
    }
    console.error("Falha error: ", error);
    return res.status(500).json({ error: "Falha no catch: ", error });
  }
};

const UpdateSenha = async function (req, res) {
  try {
    const { senha } = req.body;

    const senhaHashed = await bcrypt.hash(senha, 10);
    const valorAtuallizado = atualizarDados.atualizarSenha(
      senhaHashed,
      req.id_restaurante,
    );

    if (valorAtuallizado == null) {
      return;
    }

    return res
      .status(200)
      .json({
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
