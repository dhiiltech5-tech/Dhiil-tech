import express from 'express';
import {
  getAllServices,
  getService,
  createService,
  updateService,
  deleteService
} from '../controllers/serviceController.js';
import { permissionRequired } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllServices);
router.get('/:id', getService);
router.post('/', permissionRequired('create_service'), createService);
router.put('/:id', permissionRequired('edit_service'), updateService);
router.delete('/:id', permissionRequired('delete_service'), deleteService);

export default router;
