import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth';
import * as userController from '../controllers/userController';

const router = Router();

// Protected routes - Admin only
router.post('/', authenticateToken, requireRole('Admin'), userController.createUser);
router.get('/', authenticateToken, requireRole('Admin'), userController.getAllUsers);
router.get('/:id', authenticateToken, userController.getUserById);
router.put('/:id', authenticateToken, userController.updateUser);
router.delete('/:id', authenticateToken, requireRole('Admin'), userController.deleteUser);

// Update user role - Admin only
router.put('/:id/role', authenticateToken, requireRole('Admin'), userController.updateUserRole);

// Activate/Deactivate user - Admin only
router.put('/:id/status', authenticateToken, requireRole('Admin'), userController.updateUserStatus);

// Get user statistics
router.get('/:id/stats', authenticateToken, userController.getUserStats);

export default router;
