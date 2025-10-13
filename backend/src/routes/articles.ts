import { Router } from 'express';
import { authenticateToken, requireRole, optionalAuth } from '../middleware/auth';
import * as articleController from '../controllers/articleController';

const router = Router();

// Public routes
router.get('/', optionalAuth, articleController.getAllArticles);
router.get('/slug/:slug', optionalAuth, articleController.getArticleBySlug);
router.get('/:id', optionalAuth, articleController.getArticleById);

// Protected routes - Create article (Author, Admin)
router.post('/', authenticateToken, requireRole('Author', 'Admin'), articleController.createArticle);

// Protected routes - Update article (Author of article or Admin)
router.put('/:id', authenticateToken, articleController.updateArticle);

// Protected routes - Delete article (Admin only)
router.delete('/:id', authenticateToken, requireRole('Admin'), articleController.deleteArticle);

// Protected routes - Submit for review (Author)
router.post('/:id/submit', authenticateToken, requireRole('Author', 'Admin'), articleController.submitForReview);

// Protected routes - Publish article (Admin only)
router.post('/:id/publish', authenticateToken, requireRole('Admin'), articleController.publishArticle);

// Protected routes - Archive article (Admin only)
router.post('/:id/archive', authenticateToken, requireRole('Admin'), articleController.archiveArticle);

// Get articles by category
router.get('/category/:categorySlug', optionalAuth, articleController.getArticlesByCategory);

// Get articles by tag
router.get('/tag/:tagSlug', optionalAuth, articleController.getArticlesByTag);

// Get articles by author
router.get('/author/:authorId', optionalAuth, articleController.getArticlesByAuthor);

// Search articles
router.get('/search', optionalAuth, articleController.searchArticles);

export default router;
