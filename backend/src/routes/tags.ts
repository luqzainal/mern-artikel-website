import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth';
import * as tagController from '../controllers/tagController';

const router = Router();

// Public routes
router.get('/', tagController.getAllTags);
router.get('/:id', tagController.getTagById);
router.get('/slug/:slug', tagController.getTagBySlug);

// Protected routes - Admin only
router.post('/', authenticateToken, requireRole('Admin'), tagController.createTag);
router.put('/:id', authenticateToken, requireRole('Admin'), tagController.updateTag);
router.delete('/:id', authenticateToken, requireRole('Admin'), tagController.deleteTag);

export default router;
