import express from 'express';
import {
  getAllNews,
  getNews,
  createNews,
  updateNews,
  deleteNews
} from '../controllers/newsController.js';
import { permissionRequired } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllNews);
router.get('/:id', getNews);
router.post('/', permissionRequired('create_news'), createNews);
router.put('/:id', permissionRequired('edit_news'), updateNews);
router.delete('/:id', permissionRequired('delete_news'), deleteNews);

export default router;
