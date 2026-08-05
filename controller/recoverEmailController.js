const modelRestaurante = require("../model/restauranteModel");
const atualizarDados = require("../model/atulizarRestauranteModel");
const tokenModel = require("../model/tokenModel");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { sendRecoveryEmail } = require("../services/emailService");

const recoveryEmailVerif = async (req, res) => {
  const { email } = req.body;
  
  try {
    const emailOnSystem = await modelRestaurante.verificarEmail(email);
    if (!emailOnSystem) {
      return res.status(400).json({ erro: "Email incorreto." });
    }

    const restaurante = await modelRestaurante.login(email);
    const nome_restaurante = restaurante.nome;
    const id_restaurante = restaurante.id_restaurante;

    const token = crypto.randomBytes(20).toString("hex");
    const expira_em = new Date();
    expira_em.setHours(expira_em.getHours() + 1);

    await tokenModel.registrarToken(id_restaurante, token, expira_em);

    const linkRecuperacao = `https://menunet.onrender.com/layout/newpassword/${token}`;

    await sendRecoveryEmail(email, linkRecuperacao, nome_restaurante);

    return res.status(200).json({
      mensagem:
        "Email de recuperação enviado. Verifique a caixa entrada ou spam!",
    });
  } catch (error) {
    console.error("Falha em enviar email de recuperação: ", error);
    return res
      .status(500)
      .json({ erro: "Falha na recuperação de email! Tente mais tarde." });
  }
};

const recuperarSenha = async (req, res) => {
  const { senha, token } = req.body;

  try {
    const tokenValido = await tokenModel.buscarToken(token);
    if(!tokenValido){
      return res.status(400).json({erro: "Esse Link de recuperação e inválido."});
    }

    const agora = new Date();
    if(agora < (tokenValido.expira_em)){
      res.status(400).json({erro: "Link de recuperação expirado. Solicite um novo."});
    }

    const id_restaurante = tokenValido.id_restaurante;
    const senhaHashed = await bcrypt.hash(senha, 10);
    
    const valorAtuallizado = await atualizarDados.atualizarSenha(
      senhaHashed,
      id_restaurante,
    );

    if (valorAtuallizado == null) {
      return res.status(400).json({erro: "Falha ao atualizar senha!"});
    }
    
    await tokenModel.eliminarToken(token);

    return res.status(200).json({
      mensagem: "Senha atualizada com sucesso!",
    });
  } catch (error) {
    console.error("Falha na recuperação de senha: ", error);
    res.status(500).json({erro: "Falha ao atualizar senha. Tente mais tarde!"});
  }
};

module.exports = { recoveryEmailVerif, recuperarSenha };
