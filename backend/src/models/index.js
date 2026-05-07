import sequelize from "../config/database.js";

import User from "./User.js";
import Role from "./Role.js";

import Indicator from "./Indicator.js";
import IndicatorType from "./IndicatorType.js";
import IndicatorTrend from "./IndicatorTrend.js";

/* =========================
   RELACIONES USER / ROLE
========================= */

Role.hasMany(User, {
  foreignKey: "roleId"
});

User.belongsTo(Role, {
  foreignKey: "roleId"
});

/* =========================
   RELACIONES INDICATORS
========================= */

User.hasMany(Indicator, {
  foreignKey: "entityId"
});

Indicator.belongsTo(User, {
  foreignKey: "entityId"
});

/* =========================
   RELACIÓN TIPO
========================= */

IndicatorType.hasMany(Indicator, {
  foreignKey: "tipoId"
});

Indicator.belongsTo(IndicatorType, {
  foreignKey: "tipoId"
});

/* =========================
   RELACIÓN TENDENCIA
========================= */

IndicatorTrend.hasMany(Indicator, {
  foreignKey: "tendenciaId"
});

Indicator.belongsTo(IndicatorTrend, {
  foreignKey: "tendenciaId"
});

/* =========================
   EXPORTS
========================= */

export {
  sequelize,
  User,
  Role,
  Indicator,
  IndicatorType,
  IndicatorTrend
};