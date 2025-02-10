/*
const jwt = require("jsonwebtoken");
require('dotenv').config();

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Acesso negado", redirect: true });

  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token inválido", redirect: true });
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
*/

const jwt = require("jsonwebtoken");
const SessionKey = require("../models/SessionKey");

const authenticateToken = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Acesso negado" });

  const tokenValue = token.split(" ")[1];

  try {
    // 🔥 Decodificar o token para pegar o `userId`
    const decoded = jwt.decode(tokenValue);
    if (!decoded) return res.status(403).json({ error: "Token inválido" });

    // 🔥 Buscar a chave secreta salva no banco de dados
    const sessionKey = await SessionKey.findOne({ where: { userId: decoded.id } });
    if (!sessionKey) return res.status(403).json({ error: "Sessão expirada. Faça login novamente." });

    // 🔥 Verificar o token com a chave do usuário
    jwt.verify(tokenValue, sessionKey.secret, (err, user) => {
      if (err) return res.status(403).json({ error: "Token inválido" });
      req.user = user;
      next();
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao validar token" });
  }
};

module.exports = { authenticateToken };
