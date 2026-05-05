import bcrypt from "bcrypt";
import User from "../models/User.js";
import Role from "../models/Role.js";

export const registerEntity = async (req, res) => {
  try {
    const { name, email, pass } = req.body;

    const role = await Role.findOne({
      where: { name: "entity" }
    });

    if (!role) {
      return res.status(400).json({
        message: "Rol entidad no existe"
      });
    }

    const existUser = await User.findOne({
      where: { email }
    });

    if (existUser) {
      return res.status(400).json({
        message: "El correo ya está registrado"
      });
    }

    const hashedPassword = await bcrypt.hash(pass, 10);

    const entity = await User.create({
      name,
      email,
      password: hashedPassword,
      roleId: role.id,
      estado: true
    });

    res.status(201).json(entity);

  } catch (error) {
    console.error("ERROR CREATE ENTITY:", error);
    res.status(500).json({
      message: "Error al crear entidad"
    });
  }
};

export const getEntities = async (req, res) => {
	 try {

    const role = await Role.findOne({
      where: { name: "entity" }
    });

    if (!role) {
      return res.status(400).json({
        message: "Rol entity no existe"
      });
    }

    const entities = await User.findAll({
  		attributes: ["id", "name", "email", "estado"],
 		where: {
    		roleId: role.id
  		},
  		order: [["createdAt", "DESC"]] 
});

    res.json(entities);

  } catch (error) {

    console.error("ERROR GET ENTITIES:", error);

    res.status(500).json({
      message: "Error obteniendo entidades"
    });

  }};

export const updateEntity = async (req, res) => {
	try {
    const { id } = req.params;
    const { name, email } = req.body;

    const role = await Role.findOne({
      where: { name: "entity" }
    });

    const user = await User.findOne({
      where: {
        id,
        roleId: role.id
      }
    });

    if (!user) {
      return res.status(404).json({
        message: "Entidad no encontrada"
      });
    }

    await user.update({ name, email });

    res.json({
      message: "Entidad actualizada",
      user
    });

  } catch (error) {
    res.status(500).json({
      message: "Error actualizando entidad"
    });
  }
};

export const toggleEntity = async (req, res) => {
 	try {
    const { id } = req.params;

    const role = await Role.findOne({
      where: { name: "entity" }
    });

    const user = await User.findOne({
      	where: {
        id,
        roleId: role.id
      }
    });

    if (!user) {
      return res.status(404).json({
        message: "Entidad no encontrada"
      });
    }

    const nuevoEstado = !user.estado;

    await user.update({ estado: nuevoEstado });

    res.json({
      message: "Estado actualizado",
      entity: user
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error cambiando estado"
    });
  }
};
