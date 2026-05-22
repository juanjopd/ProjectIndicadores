import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Notification = sequelize.define('Notification', {

  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  indicatorName: {
    type: DataTypes.STRING,
  },

});

export default Notification;