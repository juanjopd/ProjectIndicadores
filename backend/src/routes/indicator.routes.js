import { Router } from "express";
import { 
    createIndicator,  
    getIndicators,
    deleteIndicator,
    updateIndicator,
    getIndicatorById,
    getTypes, 
    getTrends 
} from "../controllers/indicator.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

// cualquier entidad o superadmin puede crear
router.post("/", verifyToken, createIndicator);
router.get("/", verifyToken, getIndicators);
router.get("/indicator-types", verifyToken, getTypes);
router.get("/indicator-trends", verifyToken, getTrends);
router.get("/:id", verifyToken, getIndicatorById);
router.put("/:id", verifyToken, updateIndicator);
router.delete("/:id", verifyToken, deleteIndicator);

export default router;