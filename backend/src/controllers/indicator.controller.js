import Indicator from "../models/Indicator.js";
import {
  IndicatorType,
  IndicatorTrend
} from "../models/index.js";

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

    // SI ES ENTIDAD
    // EL INDICADOR SE CREA PARA ESA ENTIDAD
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

      // ENTIDAD SOLO VE SUS INDICADORES
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

      tipo: i.IndicatorType,

      tendencia: i.IndicatorTrend,

      frecuencia: i.frecuencia,

      utilidad: i.utilidad,

      meta: i.meta,

      satisfactorio: i.satisfactorio,

      critico: i.critico,

      entityId: i.entityId

    }));

    return res.json(formatted);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Error obteniendo indicadores"
    });

  }

};

export const updateIndicator = async (req, res) => {

  try {

    const { id } = req.params;

    const indicator =
      await Indicator.findByPk(id);

    if (!indicator) {

      return res.status(404).json({
        message: "Indicador no encontrado"
      });

    }

    // ENTIDAD SOLO MODIFICA SUS INDICADORES
    if (
      req.user.role !== "superadmin" &&
      indicator.entityId !== req.user.id
    ) {

      return res.status(403).json({
        message: "No autorizado"
      });

    }

    await indicator.update(req.body);

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

export const deleteIndicator = async (req, res) => {

  try {

    const { id } = req.params;

    const indicator =
      await Indicator.findByPk(id);

    if (!indicator) {

      return res.status(404).json({
        message: "Indicador no encontrado"
      });

    }

    // ENTIDAD SOLO ELIMINA LOS SUYOS
    if (
      req.user.role !== "superadmin" &&
      indicator.entityId !== req.user.id
    ) {

      return res.status(403).json({
        message: "No autorizado"
      });

    }

    await indicator.destroy();

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


export const getIndicatorById = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const indicator =
      await Indicator.findByPk(id, {

        include: [

          {
            model: User,
            attributes: ['id', 'name']
          },

          {
            model: IndicatorType,
            attributes: ['id', 'name']
          },

          {
            model: IndicatorTrend,
            attributes: ['id', 'name']
          }

        ]

      });

    if (!indicator) {

      return res.status(404).json({
        message:
          'Indicador no encontrado'
      });

    }

    // SI ES ENTIDAD
    // SOLO PUEDE VER LOS SUYOS

    if (
      req.user.role !==
        'superadmin' &&
      indicator.entityId !==
        req.user.id
    ) {

      return res.status(403).json({
        message: 'No autorizado'
      });

    }

    return res.json({

      id: indicator.id,

      nombre: indicator.nombre,

      entidad:
        indicator.User?.name,

      responsable:
        indicator.responsable,

      proceso:
        indicator.proceso,

      tipo:
        indicator.IndicatorType,

      tendencia:
        indicator.IndicatorTrend,

      frecuencia:
        indicator.frecuencia,

      utilidad:
        indicator.utilidad,

      meta: indicator.meta,

      satisfactorio:
        indicator.satisfactorio,

      critico:
        indicator.critico,

      entityId:
        indicator.entityId,

      tipoId:
        indicator.tipoId,

      tendenciaId:
        indicator.tendenciaId

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        'Error obteniendo indicador'
    });

  }

};

export const getTypes = async (req, res) => {

  try {

    const types =
      await IndicatorType.findAll();

    res.json(types);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Error obteniendo tipos"
    });

  }

};

export const getTrends = async (req, res) => {

  try {

    const trends =
      await IndicatorTrend.findAll();

    res.json(trends);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Error obteniendo tendencias"
    });

  }

};