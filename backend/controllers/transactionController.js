const Transaction = require("../models/Transaction");
const Settings = require("../models/Settings");

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { userId: req.user.id }, // 🔥 Filtra transações do usuário autenticado
      order: [["data", "DESC"]],
    });
    res.json(transactions);
  } catch (error) {
    console.error("Erro ao obter transações:", error);
    res.status(500).json({ error: "Erro ao obter transações" });
  }
};

exports.createTransaction = async (req, res) => {
  const { descricao, valor, tipo, categoria, data } = req.body;
  try {
    // Verificar se a categoria existe no plano de contas do usuário
    const settings = await Settings.findOne({ where: { userId: req.user.id } });

    if (!settings || !settings.categories.includes(categoria)) {
      return res.status(400).json({ error: "Categoria inválida" });
    }

    // Criar transação associada ao usuário
    await Transaction.create({
      userId: req.user.id, // 🔥 Associa ao usuário autenticado
      descricao,
      valor,
      tipo,
      categoria,
      data,
    });

    res.status(201).json({ message: "Transação adicionada com sucesso" });
  } catch (error) {
    console.error("Erro ao adicionar transação:", error);
    res.status(500).json({ error: "Erro ao adicionar transação" });
  }
};

exports.updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { descricao, valor, tipo, categoria, data } = req.body;

  try {
    const transaction = await Transaction.findOne({
      where: { id, userId: req.user.id }, // 🔥 Garante que o usuário só edita suas próprias transações
    });

    if (!transaction) {
      return res.status(404).json({ error: "Transação não encontrada ou não pertence a este usuário" });
    }

    transaction.descricao = descricao;
    transaction.valor = valor;
    transaction.tipo = tipo;
    transaction.categoria = categoria;
    transaction.data = data;

    await transaction.save();

    res.json({ message: "Transação atualizada com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar transação:", error);
    res.status(500).json({ error: "Erro ao atualizar transação" });
  }
};

