import express from 'express';
import {
  getAllTeam,
  getTeamMember,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember
} from '../controllers/teamController.js';
import { permissionRequired } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllTeam);
router.get('/:id', getTeamMember);
router.post('/', permissionRequired('create_team'), createTeamMember);
router.put('/:id', permissionRequired('edit_team'), updateTeamMember);
router.delete('/:id', permissionRequired('delete_team'), deleteTeamMember);

export default router;
