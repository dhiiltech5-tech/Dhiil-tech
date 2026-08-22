import express from 'express';
import {
  subscribeNewsletter,
  getAllSubscribers,
  unsubscribeNewsletter
} from '../controllers/newsletterController.js';
import { permissionRequired } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', subscribeNewsletter);
router.get('/', permissionRequired('view_subscribers'), getAllSubscribers);
router.delete('/:id', permissionRequired('delete_subscribers'), unsubscribeNewsletter);

export default router;
