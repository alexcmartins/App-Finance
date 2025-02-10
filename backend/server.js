const express = require("express");
const cors = require("cors");
require("dotenv").config();
const sequelize = require("./config/database");

// Importação das Rotas
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const settingsRoutes = require("./routes/settingsRoutes");


// Middleware de autenticação
const { authenticateToken } = require("./middleware/authMiddleware");

const app = express();
const port = process.env.PORT || 5000;
const host = process.env.SERVER_HOST || "0.0.0.0";

app.use(cors());
app.use(express.json());

// Conectar ao banco de dados
sequelize.sync({ alter: true })
  .then(() => console.log("Banco de dados sincronizado"))
  .catch(err => console.error("Erro ao sincronizar banco:", err));

// Definição das Rotas
app.use("/auth", authRoutes);
app.use("/transactions", authenticateToken, transactionRoutes);
app.use("/dashboard", authenticateToken, dashboardRoutes);
app.use("/settings", authenticateToken, settingsRoutes);

// Rota para obter informações do usuário logado
app.get("/me", authenticateToken, async (req, res) => {
  try {
    const User = require("./models/User");
    const user = await User.findByPk(req.user.id, { attributes: ["id", "username"] });
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    res.json({ id: user.id, username: user.username });
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter dados do usuário" });
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${host}:${port}`);
});
