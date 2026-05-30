const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = async function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ erro: "Chave de acesso em falta" });
  }

  const parts = authHeader.split(" ");

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.id_restaurante = decoded.id;
    req.email = decoded.email;
    req.slug = decoded.slug;

    return next();
  } catch (error) {
    return res.status(401).json({ erro: "Token invalido ou expirado!" });
  }
};

module.exports = { authMiddleware };
