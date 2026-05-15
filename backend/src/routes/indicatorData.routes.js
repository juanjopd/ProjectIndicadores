import { Router } from 'express';      
import {
  getIndicatorData,
  saveIndicatorData,
  deleteIndicatorData,
} from '../controllers/indicatorData.controller.js';

import { verifyToken } from '../middlewares/auth.middleware.js';
import IndicatorData from '../models/IndicatorData.js';
const router = Router();

router.get(
  '/:indicatorId/:year',
  verifyToken,
  getIndicatorData
);

router.post(
  '/',
  verifyToken,
  saveIndicatorData
);

router.delete(
  '/:id',
  verifyToken,
 );

 export default router;



   







