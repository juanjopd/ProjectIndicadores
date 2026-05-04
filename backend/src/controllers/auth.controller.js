import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Role from "../models/Role.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: Role
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.Role.name
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 🔥 AQUÍ ESTÁ LA CLAVE (cookie)
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true en producción
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({
      user: {
        id: user.id,
        name: user.name,
        role: user.Role.name
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};