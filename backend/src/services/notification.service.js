import Notification from '../models/Notification.js';

export const createNotification = async ({
  action,
  message,
  userName,
  indicatorName,
}) => {

  try {

    await Notification.create({

      action,
      message,
      userName,
      indicatorName,

    });

  } catch (error) {

    console.log(error);

  }
};