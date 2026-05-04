export const authorize = (roles) => {
  return (req, res, next) => {

    if (!req.user || !req.user.role) {
      return res.status(401).json({
        message: "Usuario no autenticado correctamente"
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "No tienes permiso para esta acción"
      });
    }

    next();
  };
};
