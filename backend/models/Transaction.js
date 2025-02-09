/*
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Transaction = sequelize.define("Transaction", {
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
    type: DataTypes.ENUM("entrada", "saida"),
    allowNull: false,
  },
  data: {
    type: DataTypes.DATE,
    defaultValue: sequelize.NOW,
  },
});

module.exports = Transaction;
*/

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User"); // Importa o modelo de usuário

const Transaction = sequelize.define("Transaction", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
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
    type: DataTypes.ENUM("entrada", "saida"),
    allowNull: false,
  },
  categoria: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  data: {
    type: DataTypes.DATE,
    defaultValue: sequelize.NOW,
  },
});

// Criar relação com Usuário
User.hasMany(Transaction, { foreignKey: "userId" });
Transaction.belongsTo(User, { foreignKey: "userId" });

module.exports = Transaction;
