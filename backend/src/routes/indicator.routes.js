import { Router } from "express";
import { 
    createIndicator,  
    getIndicators,
    deleteIndicator,
    updateIndicator, 
    getTypes, 
    getTrends 
} from "../controllers/indicator.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

// cualquier entidad o superadmin puede crear
router.post("/", verifyToken, createIndicator);
router.get("/", verifyToken, getIndicators);

router.put("/:id", verifyToken, updateIndicator);

router.delete("/:id", verifyToken, deleteIndicator);
router.get("/indicator-types", verifyToken, getTypes);
router.get("/indicator-trends", verifyToken, getTrends);

export default router;