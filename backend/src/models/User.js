import { DataTypes } from "sequelize";
import sequelize from "../config/database.js"
import Role from "./Role.js"

const User = sequelize.define("User", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false
	},
	estado: {
		type: DataTypes.BOOLEAN,
		defaultValue: true
	}
}, {
	tableName: "users",
	timestamps: true
});

//Relacion 
Role.hasMany(User, { foreignKey: "roleId" });
User.belongsTo(Role, { foreignKey: "roleId" });

export default User;
