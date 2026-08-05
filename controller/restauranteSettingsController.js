const { zodError } = require("zod");
const { updateSchema } = require("../schemas/updateSchema");
const atualizarDados = require("../model/atulizarRestauranteModel");
const bcrypt = require("bcrypt");

const update = async function (req, res) {
  const data = updateSchema.parse(req.body);
  
  try {
    const valoresAtualizados = atualizarDados.atualizarDadosRestaurante(
      data.nome,
      data.email,
      data.slug,
      req.id_restaurante,
    );

    if (!valoresAtualizados || valoresAtualizados === 0) {
      return res.status(400).json({erro: "Falha ao atualizar senha."});
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
    return res.status(500).json({ error: "Problemas com a conexão. Tente mais tarde!"});
  }
};

const senhaUpdate = async function(req, res){
  const { senha } = req.body;

  try {
    if(!senha || senha === undefined){
      return res.status(400).json({erro: "Valores invalidos."});
    }

    const senhaHashed = await bcrypt.hash(senha, 10);

    const quantSenha = await atualizarDados.atualizarSenha(senhaHashed, req.id_restaurante);

    if(!quantSenha || quantSenha === 0){
      return res.status(400).json({erro: "Falha ao atualizar senha."});
    }

    return res.status(200).json({mensagem: "Senha atualizada com sucesso", restaurante: req.id_restaurante});
  } catch (error) {
    console.error("Falha ao atualizar senha[D]: ", error);
    return res.status(500).json({erro: "Problemas com a conexao. Tente mais tarde!"});
  }
}

const UpdateSenhaRecover = async function (req, res) {
  const { token, senha } = req.body;
  
  try {
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
    console.error("Falha ao atualizar senha: ", error);
    return res
      .status(500)
      .json({ erro: "Falha no servidor! Tente mais tarde." });
  }
};

module.exports = { update, UpdateSenhaRecover, senhaUpdate };
