import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const IndicatorData = sequelize.define(
  'IndicatorData',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    indicatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    periodo: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    numerador: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    denominador: {
      type: DataTypes.FLOAT,
      defaultValue: 1,
    },

    logro: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    analisis: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    acciones: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'indicator_data',
    timestamps: true,
  }
);

export default IndicatorData;