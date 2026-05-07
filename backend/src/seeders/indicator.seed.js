import {
  IndicatorType,
  IndicatorTrend
} from "../models/index.js";

export const seedIndicators = async () => {

  /* =========================
     TIPOS
  ========================= */

  const types = [
    { name: "Eficacia" },
    { name: "Eficiencia" },
    { name: "Efectividad" }
  ];

  for (const type of types) {

    await IndicatorType.findOrCreate({
      where: { name: type.name }
    });

  }

  /* =========================
     TENDENCIAS
  ========================= */

  const trends = [
    { name: "Aumentar" },
    { name: "Disminuir" }
  ];

  for (const trend of trends) {

    await IndicatorTrend.findOrCreate({
      where: { name: trend.name }
    });

  }

  console.log("✅ Seed de indicadores ejecutado");
};