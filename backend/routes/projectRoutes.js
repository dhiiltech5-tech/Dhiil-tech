import express from 'express';
import {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/projectController.js';
import { permissionRequired } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllProjects);
router.get('/:id', getProject);
router.post('/', permissionRequired('create_project'), createProject);
router.put('/:id', permissionRequired('edit_project'), updateProject);
router.delete('/:id', permissionRequired('delete_project'), deleteProject);

export default router;
