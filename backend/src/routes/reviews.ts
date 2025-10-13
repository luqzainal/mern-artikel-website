import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth';
import * as reviewController from '../controllers/reviewController';

const router = Router();

// Protected routes - Reviewer and Admin only
router.get('/', authenticateToken, requireRole('Reviewer', 'Admin'), reviewController.getAllReviews);
router.get('/:id', authenticateToken, requireRole('Reviewer', 'Admin'), reviewController.getReviewById);
router.get('/article/:articleId', authenticateToken, requireRole('Reviewer', 'Admin', 'Author'), reviewController.getReviewsByArticle);

// Create review
router.post('/', authenticateToken, requireRole('Reviewer', 'Admin'), reviewController.createReview);

// Update review
router.put('/:id', authenticateToken, requireRole('Reviewer', 'Admin'), reviewController.updateReview);

// Delete review
router.delete('/:id', authenticateToken, requireRole('Admin'), reviewController.deleteReview);

export default router;
