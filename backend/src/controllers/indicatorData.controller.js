import IndicatorData from '../models/IndicatorData.js';
import Indicator from '../models/Indicator.js';

export const getIndicatorData = async (req, res) => {

  try {

    const { indicatorId, year } = req.params;

    const indicator = await Indicator.findByPk(indicatorId);

    if (!indicator) {

      return res.status(404).json({
        message: 'Indicador no encontrado',
      });

    }

    // SUPERADMIN VE TODO
    if (
      req.user.role !== 'superadmin' &&
      indicator.entityId !== req.user.id
    ) {

      return res.status(403).json({
        message: 'No autorizado',
      });

    }

    const data = await IndicatorData.findAll({

      where: {
        indicatorId,
        year,
      },

      order: [['periodo', 'ASC']],
    });

    res.json(data);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Error obteniendo datos',
    });

  }

};

export const saveIndicatorData = async (req, res) => {

  try {

    const {
      indicatorId,
      year,
      periodo,
      numerador,
      denominador,
      analisis,
      acciones,
    } = req.body;

    const indicator =
      await Indicator.findByPk(indicatorId);

    if (!indicator) {

      return res.status(404).json({
        message: 'Indicador no encontrado',
      });

    }

    // VALIDAR ENTIDAD
    if (
      req.user.role !== 'superadmin' &&
      indicator.entityId !== req.user.id
    ) {

      return res.status(403).json({
        message: 'No autorizado',
      });

    }

    const logro =
      Number(denominador) > 0
        ? Number(
            (
              (Number(numerador) /
                Number(denominador)) *
              100
            ).toFixed(1)
          )
        : 0;

    const existing =
      await IndicatorData.findOne({

        where: {
          indicatorId,
          year,
          periodo,
        },
      });

    if (existing) {

      await existing.update({

        numerador,
        denominador,
        logro,
        analisis,
        acciones,
      });

      return res.json(existing);

    }

    const newData =
      await IndicatorData.create({

        indicatorId,
        year,
        periodo,
        numerador,
        denominador,
        logro,
        analisis,
        acciones,
      });

    res.status(201).json(newData);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Error guardando datos',
    });

  }

};

export const deleteIndicatorData = async (req, res) => {

  try {

    const { id } = req.params;

    const data =
      await IndicatorData.findByPk(id, {

        include: [
          {
            model: Indicator,
          },
        ],
      });

    if (!data) {

      return res.status(404).json({
        message: 'Registro no encontrado',
      });

    }

    if (
      req.user.role !== 'superadmin' &&
      data.Indicator.entityId !== req.user.id
    ) {

      return res.status(403).json({
        message: 'No autorizado',
      });

    }

    await data.destroy();

    res.json({
      message: 'Registro eliminado',
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Error eliminando',
    });

  }

};