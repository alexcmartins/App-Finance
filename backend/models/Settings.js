const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Settings = sequelize.define("Settings", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true, // Cada usuário terá apenas um registro de configurações
  },
  usageType: {
    type: DataTypes.ENUM("pessoal", "empresarial", "multiempresas"),
    allowNull: false,
  },
  categories: {
    type: DataTypes.JSON, // Lista de categorias como JSON
    allowNull: false,
  },
  companies: {
    type: DataTypes.JSON, // Lista de empresas como JSON
    allowNull: true,
  },
});

module.exports = Settings;
