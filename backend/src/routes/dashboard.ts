import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import * as dashboardController from '../controllers/dashboardController';

const router = Router();

// All dashboard routes require authentication
router.use(authenticateToken);

router.get('/stats', dashboardController.getDashboardStats);
router.get('/articles-by-category', dashboardController.getArticlesByCategory);
router.get('/articles-by-status', dashboardController.getArticlesByStatus);
router.get('/recent-activities', dashboardController.getRecentActivities);

export default router;
