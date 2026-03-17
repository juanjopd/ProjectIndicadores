import { Router } from "express";
import { createUser, getUsers } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js"; 
import { getEntities, registerEntity, toggleEntity, updateEntity  } from "../controllers/entity.controller.js";


const router = Router();

// solo superadmin puede crear usuarios
router.post("/", verifyToken, authorize(["superadmin"]), createUser);

// solo superadmin puede ver todos
router.get("/", verifyToken, authorize(["superadmin"]), getUsers);

// solo superadmin puede registrar entidad
router.post("/entity", verifyToken, authorize(["superadmin"]), registerEntity);

// solo superadmin puede ver entidades registradas
router.get("/entity", verifyToken, authorize(["superadmin"]), getEntities);

// solo superadmin puede editar una entidad
router.put("/entity/:id", verifyToken, authorize(["superadmin"]), updateEntity);

// solo superadmin cambiar el estado de una entidad 
router.patch("/entity/:id/toggle", verifyToken, authorize(["superadmin"]), toggleEntity);

export default router;
