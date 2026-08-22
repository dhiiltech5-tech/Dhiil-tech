import express from 'express';
import {
  trackVisit,
  getVisitorCount,
  getPublicStats,
  getDashboardStats,
  getAnalytics,
  exportVisitsCsv
} from '../controllers/statsController.js';
import { permissionRequired } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/track-visit', trackVisit);
router.get('/visitor-count', getVisitorCount);
router.get('/public', getPublicStats);
router.get('/dashboard', permissionRequired('view_dashboard'), getDashboardStats);
router.get('/analytics', permissionRequired('view_analytics'), getAnalytics);
router.get('/export/csv', permissionRequired('export_analytics'), exportVisitsCsv);

export default router;
