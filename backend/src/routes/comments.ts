import { Router } from 'express';
import { authenticateToken, requireRole, optionalAuth } from '../middleware/auth';
import * as commentController from '../controllers/commentController';

const router = Router();

// Public routes
router.get('/article/:articleId', optionalAuth, commentController.getCommentsByArticle);

// Protected routes - Authenticated users can comment
router.post('/', authenticateToken, commentController.createComment);
router.put('/:id', authenticateToken, commentController.updateComment);
router.delete('/:id', authenticateToken, commentController.deleteComment);

// Admin routes - Approve/reject comments
router.put('/:id/approve', authenticateToken, requireRole('Admin', 'Reviewer'), commentController.approveComment);
router.put('/:id/reject', authenticateToken, requireRole('Admin', 'Reviewer'), commentController.rejectComment);

// Get all comments - Admin only
router.get('/', authenticateToken, requireRole('Admin', 'Reviewer'), commentController.getAllComments);

export default router;
