import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth';
import * as categoryController from '../controllers/categoryController';

const router = Router();

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.get('/slug/:slug', categoryController.getCategoryBySlug);

// Protected routes - Admin only
router.post('/', authenticateToken, requireRole('Admin'), categoryController.createCategory);
router.put('/:id', authenticateToken, requireRole('Admin'), categoryController.updateCategory);
router.delete('/:id', authenticateToken, requireRole('Admin'), categoryController.deleteCategory);

export default router;
