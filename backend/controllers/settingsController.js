const Settings = require("../models/Settings");

// Obter Configurações do Usuário
exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne({ where: { userId: req.user.id } });
    if (!settings) {
      return res.status(404).json({ message: "Configurações não encontradas" });
    }
    res.json(settings);
  } catch (error) {
    console.error("Erro ao buscar configurações:", error);
    res.status(500).json({ message: "Erro no servidor" });
  }
};

// Criar ou Atualizar Configurações
exports.saveSettings = async (req, res) => {
  try {
    const { usageType, categories, companies } = req.body;
    let settings = await Settings.findOne({ where: { userId: req.user.id } });

    if (settings) {
      // Atualiza configurações existentes
      await settings.update({ usageType, categories, companies });
    } else {
      // Cria novas configurações
      settings = await Settings.create({
        userId: req.user.id,
        usageType,
        categories,
        companies,
      });
    }

    res.json({ message: "Configurações salvas com sucesso!" });
  } catch (error) {
    console.error("Erro ao salvar configurações:", error);
    res.status(500).json({ message: "Erro no servidor" });
  }
};
