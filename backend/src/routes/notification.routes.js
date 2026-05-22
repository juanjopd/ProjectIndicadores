import { Router } from 'express';

import {
  getNotifications,
  createNotification,
  deleteNotification,
} from '../controllers/notification.controller.js';

import {
  verifyToken,
} from '../middlewares/auth.middleware.js';

const router = Router();

router.get(
  '/',
  verifyToken,
  getNotifications
);

router.post(
  '/',
  verifyToken,
  createNotification
);

router.delete(
  '/:id',
  verifyToken,
  deleteNotification
);

export default router;