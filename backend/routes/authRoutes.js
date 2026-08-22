import express from 'express';
import { login, refresh, logout, getCurrentUser, updateProfile } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/refresh', verifyToken, refresh);
router.post('/logout', verifyToken, logout);
router.get('/me', verifyToken, getCurrentUser);
router.put('/profile', verifyToken, updateProfile);

export default router;
