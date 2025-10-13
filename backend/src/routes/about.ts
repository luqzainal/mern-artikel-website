import express from 'express';
import { getAboutPage, updateAboutPage } from '../controllers/aboutController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = express.Router();

// Public route - Get About page
router.get('/', getAboutPage);

// Admin route - Update About page
router.put('/', authenticateToken, requireRole('Admin'), updateAboutPage);

export default router;

