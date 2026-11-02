const { zodError } = require("zod");
const { restauranteInfoUpdateSchema } = require("../schemas/restauranteInfoUpdateSchema");
const atualizarRestauranteDadosModel = require("../model/atulizarRestauranteInfoModel");
const bcrypt = require("bcrypt");

const atualizarInfoRestaurante = async function (req, res) {
  const reqBodyData = restauranteInfoUpdateSchema.parse(req.body);

  try {
    const valoresAtualizados =
      atualizarRestauranteDadosModel.atualizarDadosRestaurante(
        reqBodyData.nome,
        reqBodyData.email,
        reqBodyData.slug,
        req.id_restaurante,
      );

    if (!valoresAtualizados || valoresAtualizados === 0) {
      return res.status(400).json({ erro: "Falha ao atualizar dados." });
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
    console.error("Falha ao atualizar dados do restaurante: ", error);
    return res
      .status(500)
      .json({ error: "Problemas com a conexão. Tente mais tarde!" });
  }
};

const atualizarSenhaRestaurante = async function (req, res) {
  const { senha } = req.body;

  try {
    if (!senha || senha === undefined) {
      return res.status(400).json({ erro: "Valores invalidos." });
    }

    const senhaHashed = await bcrypt.hash(senha, 10);

    const isPasswordUpdated =
      await atualizarRestauranteDadosModel.atualizarSenha(
        senhaHashed,
        req.id_restaurante,
      );

    if (!isPasswordUpdated || isPasswordUpdated === 0) {
      return res.status(400).json({ erro: "Falha ao atualizar senha." });
    }

    return res
      .status(200)
      .json({
        mensagem: "Senha atualizada com sucesso",
        restaurante: req.id_restaurante,
      });
  } catch (error) {
    console.error("Falha ao atualizar senha: ", error);
    return res
      .status(500)
      .json({ erro: "Problemas com a conexao. Tente mais tarde!" });
  }
};

const atualizarSenhaEmRecuperacao = async function (req, res) {
  const { token, senha } = req.body;

  try {
    const tokenUrl = await tokenModel.buscarToken(token);

    if (!tokenUrl) {
      return res
        .status(400)
        .json({ erro: "Link de verificação inválido ou expirado!" });
    }

    const id_restaurante = tokenUrl.id_restaurante;
    const senhaHashed = await bcrypt.hash(senha, 10);

    const isPasswordUpdated =
      await atualizarRestauranteDadosModel.atualizarSenha(
        senhaHashed,
        id_restaurante,
      );

    if (!isPasswordUpdated || isPasswordUpdated === 0) {
      return res.status(400).json({ erro: "Falha ao atualizar." });
    }

    return res.status(200).json({
      mensagem: "Senha atualizada com sucesso!",
    });
  } catch (error) {
    console.error("Falha ao atualizar senha: ", error);
    return res
      .status(500)
      .json({ erro: "Falha no servidor! Tente mais tarde." });
  }
};

module.exports = {
  atualizarInfoRestaurante,
  atualizarSenhaEmRecuperacao,
  atualizarSenhaRestaurante,
};
