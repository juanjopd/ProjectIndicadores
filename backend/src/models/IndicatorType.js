import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const IndicatorType = sequelize.define("IndicatorType", {
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
  tableName: "indicator_types"
});

export default IndicatorType;