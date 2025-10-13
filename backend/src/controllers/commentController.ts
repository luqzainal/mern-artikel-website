import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

// Get all comments (Admin/Reviewer only)
export const getAllComments = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '20', isApproved } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const where: any = {};

    if (isApproved !== undefined) {
      where.isApproved = isApproved === 'true';
    }

    const total = await prisma.comment.count({ where });

    const comments = await prisma.comment.findMany({
      where,
      skip,
      take,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePicture: true,
          },
        },
        article: {
          select: {
            id: true,
            slug: true,
            translations: {
              select: {
                language: true,
                title: true,
              },
              take: 1,
            },
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      data: comments,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    logger.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

// Get comments by article
export const getCommentsByArticle = async (req: Request, res: Response) => {
  try {
    const { articleId } = req.params;
    const { page = '1', limit = '20' } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    // Only show approved comments for public
    const where = {
      articleId,
      isApproved: true,
      parentId: null, // Only get top-level comments
    };

    const total = await prisma.comment.count({ where });

    const comments = await prisma.comment.findMany({
      where,
      skip,
      take,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
        replies: {
          where: {
            isApproved: true,
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profilePicture: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      data: comments,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    logger.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

// Create comment
export const createComment = async (req: AuthRequest, res: Response) => {
  try {
    const { articleId, content, parentId } = req.body;

    // Check if article exists
    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Check if article is published
    if (article.status !== 'PUBLISHED') {
      return res.status(400).json({ error: 'Cannot comment on unpublished article' });
    }

    // If replying to a comment, check if parent exists
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
      });

      if (!parentComment) {
        return res.status(404).json({ error: 'Parent comment not found' });
      }

      if (parentComment.articleId !== articleId) {
        return res.status(400).json({ error: 'Parent comment does not belong to this article' });
      }
    }

    // Create comment (requires approval by default)
    const comment = await prisma.comment.create({
      data: {
        articleId,
        userId: req.user!.id,
        content,
        parentId: parentId || null,
        isApproved: false, // Requires admin approval
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
      },
    });

    logger.info(`Comment created: ${comment.id} by ${req.user!.email}`);
    res.status(201).json({
      ...comment,
      message: 'Comment submitted for approval',
    });
  } catch (error) {
    logger.error('Error creating comment:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

// Update comment
export const updateComment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    // Check if comment exists
    const existingComment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!existingComment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Check if user is the comment author or admin
    if (existingComment.userId !== req.user!.id && req.user!.roleName !== 'Admin') {
      return res.status(403).json({ error: 'Not authorized to update this comment' });
    }

    // Update comment (set isApproved to false for re-approval)
    const comment = await prisma.comment.update({
      where: { id },
      data: {
        content,
        isApproved: false, // Requires re-approval after edit
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
      },
    });

    logger.info(`Comment updated: ${comment.id}`);
    res.json({
      ...comment,
      message: 'Comment updated and submitted for approval',
    });
  } catch (error) {
    logger.error('Error updating comment:', error);
    res.status(500).json({ error: 'Failed to update comment' });
  }
};

// Delete comment
export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check if comment exists
    const existingComment = await prisma.comment.findUnique({
      where: { id },
      include: {
        replies: true,
      },
    });

    if (!existingComment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Check if user is the comment author or admin
    if (existingComment.userId !== req.user!.id && req.user!.roleName !== 'Admin') {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }

    // Delete comment and all replies (cascade)
    await prisma.comment.delete({
      where: { id },
    });

    logger.info(`Comment deleted: ${id}`);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    logger.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};

// Approve comment
export const approveComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const comment = await prisma.comment.update({
      where: { id },
      data: { isApproved: true },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
      },
    });

    logger.info(`Comment approved: ${id}`);
    res.json(comment);
  } catch (error) {
    logger.error('Error approving comment:', error);
    res.status(500).json({ error: 'Failed to approve comment' });
  }
};

// Reject comment
export const rejectComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Delete rejected comment
    await prisma.comment.delete({
      where: { id },
    });

    logger.info(`Comment rejected and deleted: ${id}`);
    res.json({ message: 'Comment rejected and deleted successfully' });
  } catch (error) {
    logger.error('Error rejecting comment:', error);
    res.status(500).json({ error: 'Failed to reject comment' });
  }
};
