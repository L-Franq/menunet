const pratosModel = require("../model/pratosModel");
const { pratoSchema } = require("../schemas/pratoSchema");
const { ZodError } = require("zod");

const registroPrato = async function (req, res) {
  try {
    const data = pratoSchema.parse(req.body);

    if (!req.id_restaurante) {
      return res.status(401).json({ erro: "Falha nas credenciais!" });
    }

    if (!req.file) {
      return res.status(400).json({ erro: "A imagem do prato e obrigatoria!" });
    }

    const imagemPath = req.file.path;

    const registerPrato = await pratosModel.registerPrato(
      req.id_restaurante,
      data.nome,
      data.descricao,
      data.preco,
      data.categoria,
      imagemPath,
    );

    if (registerPrato) {
      return res.status(201).json({ mensagem: "Pratos adicionados ao menu" });
    }
    return res.status(400).json({erro: "Não foi possível registrar o prato!"});
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        erro: error.errors?.[0]?.message || "Dados incorretos!",
      });
    }
    console.error("Falha Catch: ", error);
    return res
      .status(500)
      .json({ erro: "Servidor indisponivel. Tente mais tarde!" });
  }
};

module.exports = { registroPrato };
