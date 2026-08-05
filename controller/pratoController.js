const pratosModel = require("../model/pratosModel");
const { pratoSchema } = require("../schemas/pratoSchema");
const { ZodError } = require("zod");

const registroPrato = async function (req, res) {
  const data = pratoSchema.parse(req.body);
  
  try {
    if (!req.id_restaurante) {
      return res.status(401).json({ erro: "Gerente não identificado. Falha com as credenciais." });
    }

    if (!req.file) {
      return res.status(400).json({ erro: "Imagem do prato em falta. É obrigatória!" });
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
      return res.status(201).json({ mensagem: "Pratos adicionados ao menu." });
    }
    return res
      .status(400)
      .json({ erro: "Não foi possível registrar o prato!" });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        erro: error.errors?.[0]?.message || "Dados incorretos!",
      });
    }
    console.error("Falha em registrar pratos: ", error);
    return res
      .status(500)
      .json({ erro: "Falha Temporária. Tente mais dentro de instantes!" });
  }
};

const mostarMenu = async (req, res) => {
  try {
    const menuRestaurante = await pratosModel.mostrarMenuPorSlug(
      req.params.slug,
    );

    if (!menuRestaurante || menuRestaurante.length === 0) {
      return res
        .status(404)
        .json({ erro: `Nenhum menu encontrado de ${req.params.slug}.` });
    }

    return res.status(200).json({ mensagem: menuRestaurante });
  } catch (error) {
    console.error("Falha em mostrar menus: ", error);
    return res
      .status(500)
      .json({ erro: "Falha ao buscar menu! Experimente atualizar a página." });
  }
};

module.exports = { registroPrato, mostarMenu };
