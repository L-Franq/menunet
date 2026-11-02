const modelRestaurante = require("../model/restauranteModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { ZodError } = require("zod");
const { registerSchema } = require("../schemas/restauranteRegisterSchema");
const { loginSchema } = require("../schemas/loginSchema");

const register = async function (req, res) {
   const reqBodyData = registerSchema.parse(req.body);

  try {
    const isAlreadyRegistered = await modelRestaurante.verificarEmail(reqBodyData.email);

    if (isAlreadyRegistered) {
      return res.status(400).json({ erro: "Email já cadastrado!" });
    }

    const senhaHashed = await bcrypt.hash(reqBodyData.senha, 10);

    const restaurante = await modelRestaurante.registrar(
      reqBodyData.nome,
      reqBodyData.email,
      senhaHashed,
      reqBodyData.slug,
    );

    if (restaurante) {
      return res.status(201).json({ mensagem: "Cadastrado com sucesso!" });
    }
  } catch (error) {
    if (error instanceof ZodError) {
      res
        .status(400)
        .json({ erro: error.errors?.[0]?.message || "Dados Inválidos" });
    }
    console.error("Falha em cadastrar: ", error);
    return res
      .status(500)
      .json({ erro: "Falha temporária no servidor. Tente mais tarde!" });
  }
};

const login = async function (req, res) {
  const reqBodyData = loginSchema.parse(req.body);

  try {
    const restauranteIn = await modelRestaurante.login(reqBodyData.email);

    if (!restauranteIn) {
      return res.status(401).json({ erro: "Email ou senha incorretos!" });
    }

    const senhaCorreta = await bcrypt.compare(reqBodyData.senha, restauranteIn.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: "Email ou senha incorretos!" });
    }

    const payload = {
      id: restauranteIn.id_restaurante,
      slug: restauranteIn.slug,
      email: restauranteIn.email,
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "15d",
    });

    return res.status(200).json({
      mensagem: "Login bem sucedido!",
      token: token,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res
        .status(400)
        .json({ erro: error.errors?.[0]?.message || "Dados Inválidos" });
    }
    console.error("Falha com o login: ", error);
    return res
      .status(500)
      .json({ erro: "Problemas na conexão. Tente dentro de instantes!" });
  }
};

const MostarDadosrestaurantes = async function (req, res) {
  try {
    const dadosRestauranteIn = await modelRestaurante.buscarDadosRestaurantes(req.id_restaurante);

    if (!dadosRestauranteIn) {
      return res.status(400).json({ erro: "Falha ao buscar os dados." });
    }

    return res
      .status(200)
      .json({ mensagem: `Bem-vindo ${dadosRestauranteIn.nome}`, restaurante: dadosRestauranteIn });
  } catch (error) {
    console.error("Falha ao buscar dados do restaurante: ", error);
    return res
      .status(500)
      .json({ erro: "Problemas na conexão. Tente dentro de instantes!" });
  }
};

module.exports = { register, login, MostarDadosrestaurantes };
