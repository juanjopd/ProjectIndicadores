import { Router } from "express";
import {
  registerEntity,
  getEntities,
  updateEntity,
  toggleEntity
} from "../controllers/entity.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = Router();

// solo superadmin puede registrar entidad
router.post("/", verifyToken, authorize(["superadmin"]), registerEntity);

// solo superadmin puede ver entidades registradas
router.get("/", verifyToken, authorize(["superadmin"]), getEntities);

// solo superadmin puede editar una entidad
router.put("/:id", verifyToken, authorize(["superadmin"]), updateEntity);

// solo superadmin cambiar el estado de una entidad 
router.patch("/:id/toggle", verifyToken, authorize(["superadmin"]), toggleEntity);

export default router;