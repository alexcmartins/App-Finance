const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//require('dotenv').config();
const crypto = require("crypto");
const SessionKey = require("../models/SessionKey");
const RefreshToken = require("../models/RefreshToken");
const { Op } = require("sequelize");

exports.register = async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ username, password: hashedPassword });
    res.status(201).json({ message: "Usuário registrado com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao registrar usuário" });
  }
};

/*
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, id: user.id, username: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
};*/

/*
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    // 🔥 Gerar uma nova chave secreta única para o usuário
    const newSecret = crypto.randomBytes(32).toString("hex");

    // 🔥 Salvar ou atualizar a chave do usuário no banco de dados
    await SessionKey.upsert({ userId: user.id, secret: newSecret });

    // 🔥 Gerar o token JWT com a chave secreta recém-criada
    const token = jwt.sign({ id: user.id, username: user.username }, newSecret, { expiresIn: "1h" });

    res.json({ token, id: user.id, username: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
};*/

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    // 🔥 Gerar chave secreta dinâmica
    const newSecret = crypto.randomBytes(32).toString("hex");
    await SessionKey.upsert({ userId: user.id, secret: newSecret });

    // 🔥 Criar Access Token (expira em 1 hora)
    const token = jwt.sign({ id: user.id, username: user.username }, newSecret, { expiresIn: "1h" });

    // 🔥 Criar Refresh Token (expira em 7 dias)
    const refreshToken = jwt.sign({ id: user.id }, newSecret, { expiresIn: "7d" });

    // 🔥 Salvar Refresh Token no banco
    await RefreshToken.create({
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
    });

    res.json({ token, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ error: "Refresh Token não fornecido" });

  try {
    // 🔥 Verifica se o Refresh Token é válido e pertence ao usuário
    const storedToken = await RefreshToken.findOne({
      where: { token: refreshToken, expiresAt: { [Op.gt]: new Date() } }, // Expira em 7 dias
    });

    if (!storedToken) return res.status(403).json({ error: "Refresh Token inválido ou expirado" });

    // 🔥 Buscar a chave secreta dinâmica do usuário
    const sessionKey = await SessionKey.findOne({ where: { userId: storedToken.userId } });
    if (!sessionKey) return res.status(403).json({ error: "Sessão inválida" });

    // 🔥 Gerar um novo Access Token (válido por 1 hora)
    const newToken = jwt.sign({ id: storedToken.userId }, sessionKey.secret, { expiresIn: "1h" });

    res.json({ token: newToken });
  } catch (error) {
    console.error("Erro ao renovar token:", error);
    res.status(500).json({ error: "Erro ao renovar token" });
  }
};