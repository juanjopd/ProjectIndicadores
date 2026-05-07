import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Indicator = sequelize.define("Indicator", {

  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  nombre: DataTypes.STRING,
  proceso: DataTypes.STRING,
  responsable: DataTypes.STRING,

  frecuencia: DataTypes.STRING,
  utilidad: DataTypes.TEXT,

  meta: DataTypes.FLOAT,
  satisfactorio: DataTypes.FLOAT,
  critico: DataTypes.FLOAT,

  entityId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  tipoId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  tendenciaId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }

}, {
  tableName: "indicators",
  timestamps: true
});

export default Indicator;