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


export default router;
