import Notification from '../models/Notification.js';

export const getNotifications = async (
  req,
  res
) => {

  try {

    const notifications =
      await Notification.findAll({

        order: [['createdAt', 'DESC']],

        limit: 30,

      });

    res.json(notifications);

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message:
        'Error obteniendo notificaciones',

    });

  }

};

export const createNotification =
  async (req, res) => {

    try {

      const {
        action,
        message,
        userName,
        indicatorName,
      } = req.body;

      const notification =
        await Notification.create({

          action,

          message,

          userName,

          indicatorName,

        });

      res.status(201).json({

        message:
          'Notificación creada',

        notification,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          'Error creando notificación',

      });

    }

  };

export const deleteNotification =
  async (req, res) => {

    try {

      const { id } = req.params;

      const notification =
        await Notification.findByPk(id);

      if (!notification) {

        return res.status(404).json({

          message:
            'Notificación no encontrada',

        });

      }

      await notification.destroy();

      res.json({

        message:
          'Notificación eliminada',

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          'Error eliminando notificación',

      });

    }

  };