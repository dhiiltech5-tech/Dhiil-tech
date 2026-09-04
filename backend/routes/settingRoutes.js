import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingController.js';
import { permissionRequired } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getSettings);
router.put('/', permissionRequired('edit_settings'), updateSettings);

export default router;
