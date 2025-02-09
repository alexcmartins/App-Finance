const Transaction = require("../models/Transaction");

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalReceitas = await Transaction.sum("valor", { where: { tipo: "entrada", userId } }) || 0;
    const totalDespesas = await Transaction.sum("valor", { where: { tipo: "saida", userId } }) || 0;
    const saldoAtual = totalReceitas - totalDespesas;

    res.json({
      total_receitas: totalReceitas,
      total_despesas: totalDespesas,
      saldo_atual: saldoAtual,
    });
  } catch (error) {
    console.error("Erro ao obter métricas do dashboard:", error);
    res.status(500).json({ error: "Erro ao obter métricas do dashboard" });
  }
};
