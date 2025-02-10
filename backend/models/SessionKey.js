// models/SessionKey.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const SessionKey = sequelize.define("SessionKey", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true, // Cada usuário tem uma única chave
    references: {
      model: "Users",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  secret: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = SessionKey;
