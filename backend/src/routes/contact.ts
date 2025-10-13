import express from 'express';
import {
  submitContact,
  getAllContactSubmissions,
  getContactSubmission,
  markAsRead,
  markAsReplied,
  deleteContactSubmission,
} from '../controllers/contactController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = express.Router();

// Public route - Submit contact form
router.post('/submit', submitContact);

// Admin routes - Manage contact submissions
router.get(
  '/',
  authenticateToken,
  requireRole('Admin'),
  getAllContactSubmissions
);
router.get(
  '/:id',
  authenticateToken,
  requireRole('Admin'),
  getContactSubmission
);
router.patch(
  '/:id/read',
  authenticateToken,
  requireRole('Admin'),
  markAsRead
);
router.patch(
  '/:id/replied',
  authenticateToken,
  requireRole('Admin'),
  markAsReplied
);
router.delete(
  '/:id',
  authenticateToken,
  requireRole('Admin'),
  deleteContactSubmission
);

export default router;

