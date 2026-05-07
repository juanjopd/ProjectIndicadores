import Indicator from "../models/Indicator.js";
import { IndicatorType, IndicatorTrend } from "../models/index.js";

export const createIndicator = async (req, res) => {

  try {

    const {
      nombre,
      proceso,
      responsable,
      tipoId,
      tendenciaId,
      frecuencia,
      utilidad,
      meta,
      satisfactorio,
      critico,
      entityId
    } = req.body;

    let finalEntityId = entityId;

    if (req.user.role === "entidad") {
      finalEntityId = req.user.id;
    }

    const indicator = await Indicator.create({
      nombre,
      proceso,
      responsable,

      tipoId,
      tendenciaId,

      frecuencia,
      utilidad,

      meta: Number(meta),
      satisfactorio: Number(satisfactorio),
      critico: Number(critico),

      entityId: Number(finalEntityId)
    });

    // 🔥 ESTO FALTABA
    return res.status(201).json({
      message: "Indicador creado",
      indicator
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message: "Error creando indicador"
    });

  }

};

export const getTypes = async (req, res) => {
  const types = await IndicatorType.findAll();
  res.json(types);
};

export const getTrends = async (req, res) => {
  const trends = await IndicatorTrend.findAll();
  res.json(trends);
};