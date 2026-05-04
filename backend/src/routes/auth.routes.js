import { Router } from "express";
import { login } from "../controllers/auth.controller.js";
import { getMe } from "../controllers/auth.controller.js";
import { logout } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", login);
router.get("/me", verifyToken, getMe);
router.post("/logout", logout);

export default router;
