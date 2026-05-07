import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const IndicatorTrend = sequelize.define("IndicatorTrend", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  tableName: "indicator_trends"
});

export default IndicatorTrend;