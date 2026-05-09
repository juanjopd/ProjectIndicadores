import Indicator from "../models/Indicator.js";
import { IndicatorType, IndicatorTrend } from "../models/index.js";
import User from "../models/User.js";

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

export const getIndicators = async (req, res) => {

  try {

    let indicators;

    // SUPERADMIN VE TODOS
    if (req.user.role === "superadmin") {

      indicators = await Indicator.findAll({
        include: [
          {
            model: User,
            attributes: ["id", "name"]
          },
          {
            model: IndicatorType,
            attributes: ["id", "name"]
          },
          {
            model: IndicatorTrend,
            attributes: ["id", "name"]
          }
        ],
        order: [["id", "DESC"]]
      });

    } else {

      // ENTIDAD SOLO VE LOS SUYOS
      indicators = await Indicator.findAll({
        where: {
          entityId: req.user.id
        },

        include: [
          {
            model: User,
            attributes: ["id", "name"]
          },
          {
            model: IndicatorType,
            attributes: ["id", "name"]
          },
          {
            model: IndicatorTrend,
            attributes: ["id", "name"]
          }
        ],

        order: [["id", "DESC"]]
      });

    }
 const formatted = indicators.map((i) => ({

      id: i.id,

      nombre: i.nombre,

      entidad: i.User?.name,

      responsable: i.responsable,

      proceso: i.proceso,

      tipo: i.IndicatorType?.name,

      tendencia: i.IndicatorTrend?.name,

      frecuencia: i.frecuencia,

      utilidad: i.utilidad,

      meta: i.meta,

      satisfactorio: i.satisfactorio,

      critico: i.critico,

    }));

    // 🔥 devolver los datos formateados
    return res.json(formatted);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Error obteniendo indicadores"
    });

  }

};


export const deleteIndicator = async (req, res) => {

  try {

    const { id } = req.params;

    await Indicator.destroy({
      where: {
        id
      }
    });

    res.json({
      message: "Indicador eliminado"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Error eliminando indicador"
    });

  }

};

export const updateIndicator = async (req, res) => {

  try {

    const { id } = req.params;

    await Indicator.update(req.body, {
      where: {
        id
      }
    });

    res.json({
      message: "Indicador actualizado"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Error actualizando indicador"
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