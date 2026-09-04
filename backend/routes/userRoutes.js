import express from 'express';
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/userController.js';
import { permissionRequired } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', permissionRequired('view_users'), getAllUsers);
router.post('/', permissionRequired('create_user'), createUser);
router.put('/:id', permissionRequired('edit_user'), updateUser);
router.delete('/:id', permissionRequired('delete_user'), deleteUser);

export default router;
