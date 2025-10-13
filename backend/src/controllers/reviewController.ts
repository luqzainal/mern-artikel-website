import { Request, Response } from 'express';
import { PrismaClient, ReviewStatus, ArticleStatus } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

// Get all reviews
export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const { status, page = '1', limit = '10' } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const where: any = {};

    if (status) {
      where.status = status as ReviewStatus;
    }

    const total = await prisma.review.count({ where });

    const reviews = await prisma.review.findMany({
      where,
      skip,
      take,
      include: {
        article: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            translations: {
              select: {
                language: true,
                title: true,
              },
            },
          },
        },
        reviewer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      data: reviews,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    logger.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

// Get review by ID
export const getReviewById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        article: {
          include: {
            translations: true,
          },
        },
        reviewer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json(review);
  } catch (error) {
    logger.error('Error fetching review:', error);
    res.status(500).json({ error: 'Failed to fetch review' });
  }
};

// Get reviews by article
export const getReviewsByArticle = async (req: Request, res: Response) => {
  try {
    const { articleId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { articleId },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(reviews);
  } catch (error) {
    logger.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

// Create review
export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const { articleId, status, comments } = req.body;

    // Check if article exists
    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Check if article is in review status
    if (article.status !== ArticleStatus.PENDING_REVIEW && article.status !== ArticleStatus.IN_REVIEW) {
      return res.status(400).json({ error: 'Article is not in review status' });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        articleId,
        reviewerId: req.user!.id,
        status: status as ReviewStatus,
        comments,
      },
      include: {
        article: true,
        reviewer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Update article status based on review
    let newArticleStatus: any = article.status;

    if (status === 'APPROVED') {
      newArticleStatus = 'APPROVED' as any;
    } else if (status === 'REJECTED') {
      newArticleStatus = 'REJECTED' as any;
    } else if (status === 'CHANGES_REQUESTED') {
      newArticleStatus = 'DRAFT' as any;
    }

    await prisma.article.update({
      where: { id: articleId },
      data: { status: newArticleStatus },
    });

    logger.info(`Review created: ${review.id} for article ${articleId}`);
    res.status(201).json(review);
  } catch (error) {
    logger.error('Error creating review:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
};

// Update review
export const updateReview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, comments } = req.body;

    // Check if review exists
    const existingReview = await prisma.review.findUnique({
      where: { id },
      include: { article: true },
    });

    if (!existingReview) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Check if user is the reviewer or admin
    if (existingReview.reviewerId !== req.user!.id && req.user!.roleName !== 'Admin') {
      return res.status(403).json({ error: 'Not authorized to update this review' });
    }

    // Update review
    const review = await prisma.review.update({
      where: { id },
      data: {
        status: status as ReviewStatus,
        comments,
      },
      include: {
        article: true,
        reviewer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Update article status based on review
    let newArticleStatus = existingReview.article.status;

    if (status === 'APPROVED') {
      newArticleStatus = ArticleStatus.APPROVED;
    } else if (status === 'REJECTED') {
      newArticleStatus = ArticleStatus.REJECTED;
    } else if (status === 'CHANGES_REQUESTED') {
      newArticleStatus = ArticleStatus.DRAFT;
    }

    await prisma.article.update({
      where: { id: existingReview.articleId },
      data: { status: newArticleStatus },
    });

    logger.info(`Review updated: ${review.id}`);
    res.json(review);
  } catch (error) {
    logger.error('Error updating review:', error);
    res.status(500).json({ error: 'Failed to update review' });
  }
};

// Delete review
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.review.delete({
      where: { id },
    });

    logger.info(`Review deleted: ${id}`);
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    logger.error('Error deleting review:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
};
