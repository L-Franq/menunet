const modelRestaurante = require("../model/restauranteModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { ZodError } = require("zod");
const { registerSchema } = require("../schemas/registerSchema");
const { loginSchema } = require("../schemas/loginSchema");

const register = async function (req, res) {
  try {
    const data = registerSchema.parse(req.body);

    const verificar = await modelRestaurante.verificarEmail(data.email);

    if (verificar) {
      return res.status(400).json({ erro: "Email ja cadastrado!" });
    }

    const senhaHashed = await bcrypt.hash(data.senha, 10);

    const restaurante = await modelRestaurante.registrar(
      data.nome,
      data.email,
      senhaHashed,
      data.slug,
    );

    if (restaurante) {
      return res.status(201).json({ mensagem: "Cadastrado com sucesso!" });
    }
  } catch (error) {
    if (error instanceof ZodError) {
      res
        .status(400)
        .json({ erro: error.errors?.[0]?.message || "Dados Invalidos" });
    }
    console.error("Falha catch: ", error);
    return res
      .status(500)
      .json({ erro: "Falha temporaria no servidor. Tente mais tarde!" });
  }
};

const login = async function (req, res) {
  try {
    const data = loginSchema.parse(req.body);

    const result = await modelRestaurante.login(data.email);

    if (!result) {
      return res.status(401).json({ erro: "Email ou senha incorretos!" });
    }

    const senhaCorreta = await bcrypt.compare(data.senha, result.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: "Email ou senha incorretos!" });
    }

    const payload = {
      id: result.id_restaurante,
      slug: result.slug,
      email: result.email,
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "15d",
    });

    return res
      .status(200)
      .json({
        mensagem: "Login bem sucedido!",
        token: token
      });
  } catch (error) {
    if (error instanceof ZodError) {
      return res
        .status(400)
        .json({ erro: error.errors?.[0]?.message || "Dados Invalidos" });
    }
    console.error("Falha catch: ", error);
    return res
      .status(500)
      .json({ erro: "Servidor indisponivel. Tente mais tarde" });
  }
};

const dadosrestaurantes = async function (req, res) {
  try {
    const result = await modelRestaurante.dados(req.id_restaurante);

    if (!result) {
      return res.status(400).json({ erro: "Falha ao buscar os dados." });
    }

    return res
      .status(200)
      .json({ mensagem: `Bem-vindo ${result.nome}`, restaurante: result });
  } catch (error) {
    console.error("Falha catch: ", error);
    return res
      .status(500)
      .json({ erro: "Servidor indisponivel. Tente mais tarde" });
  }
};

module.exports = { register, login, dadosrestaurantes };
