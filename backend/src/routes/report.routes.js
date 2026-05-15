import { Router } from 'express';

import { verifyToken } from '../middlewares/auth.middleware.js';

import {
  generateIndicatorReport,
} from '../controllers/report.controller.js';

const router = Router();

router.get(
  '/indicator/:indicatorId/:year',
  verifyToken,
  generateIndicatorReport
);

export default router;