import express from 'express';
import {
  getAllTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
} from '../controllers/testimonialController.js';
import { permissionRequired } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllTestimonials);
router.get('/:id', getTestimonial);
router.post('/', permissionRequired('create_testimonial'), createTestimonial);
router.put('/:id', permissionRequired('edit_testimonial'), updateTestimonial);
router.delete('/:id', permissionRequired('delete_testimonial'), deleteTestimonial);

export default router;
