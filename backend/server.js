const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const host = process.env.SERVER_HOST || '0.0.0.0';

app.use(cors());
app.use(express.json());

// Configuração do Sequelize e PostgreSQL
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT, // Adicionado para garantir que o Sequelize use a porta correta
      dialect: 'postgres',
      logging: false,
    }
  );
  

// Definição do modelo de Usuário
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Definição do modelo de Transação
const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  tipo: {
    type: DataTypes.ENUM('entrada', 'saida'),
    allowNull: false,
  },
  data: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
});

// Sincronizar modelos com o banco de dados
sequelize.sync()
  .then(() => console.log('Banco de dados sincronizado'))
  .catch(err => console.error('Erro ao sincronizar banco:', err));

// Middleware de autenticação JWT
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Acesso negado' });

  jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
};

// Rota de registro de usuário
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ username, password: hashedPassword });
    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
});

// Rota de login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    // Criar token JWT com ID e username do usuário
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, id: user.id, username: user.username }); // Agora retorna o username
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// Aplicar autenticação JWT nas rotas protegidas
app.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const totalReceitas = await Transaction.sum('valor', { where: { tipo: 'entrada' } }) || 0;
    const totalDespesas = await Transaction.sum('valor', { where: { tipo: 'saida' } }) || 0;
    const saldoAtual = totalReceitas - totalDespesas;
    res.json({ total_receitas: totalReceitas, total_despesas: totalDespesas, saldo_atual: saldoAtual });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao obter métricas' });
  }
});

app.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const transactions = await Transaction.findAll({ order: [['data', 'DESC']] });
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao obter transações' });
  }
});

app.post('/transactions', authenticateToken, async (req, res) => {
  const { descricao, valor, tipo, data } = req.body;
  try {
    await Transaction.create({ descricao, valor, tipo, data });
    res.status(201).json({ message: 'Transação adicionada com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao adicionar transação' });
  }
});

app.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: ['id', 'username'] });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    res.json({ id: user.id, username: user.username });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter dados do usuário' });
  }
});


app.listen(port, () => {
  console.log(`Servidor rodando na porta ${host}:${port}`);
});