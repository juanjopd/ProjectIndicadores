import { Router } from "express";
import { createIndicator, getTypes, getTrends } from "../controllers/indicator.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

// cualquier entidad o superadmin puede crear
router.post("/", verifyToken, createIndicator);

router.get("/indicator-types", verifyToken, getTypes);
router.get("/indicator-trends", verifyToken, getTrends);

export default router;