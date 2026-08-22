import express from 'express';
import {
  submitContact,
  getAllContacts,
  markAsRead,
  deleteContact
} from '../controllers/contactController.js';
import { permissionRequired } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', submitContact);
router.get('/', permissionRequired('view_messages'), getAllContacts);
router.put('/:id/read', permissionRequired('edit_messages'), markAsRead);
router.delete('/:id', permissionRequired('delete_messages'), deleteContact);

export default router;
