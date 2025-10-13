import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Upload image
export const uploadImage = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { articleId, altText } = req.body;

    // Create media record
    const media = await prisma.media.create({
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        url: `/uploads/${req.file.filename}`,
        altText: altText || req.file.originalname,
        articleId: articleId || null,
      },
    });

    logger.info(`Image uploaded: ${media.id} by ${req.user!.email}`);
    res.status(201).json(media);
  } catch (error) {
    // Delete uploaded file if database operation fails
    if (req.file) {
      const filePath = path.join(process.env.UPLOAD_DIR || './uploads', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    logger.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
};

// Get all media
export const getAllMedia = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '20', articleId } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const where: any = {};

    if (articleId) {
      where.articleId = articleId as string;
    }

    const total = await prisma.media.count({ where });

    const media = await prisma.media.findMany({
      where,
      skip,
      take,
      include: {
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
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      data: media,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    logger.error('Error fetching media:', error);
    res.status(500).json({ error: 'Failed to fetch media' });
  }
};

// Get media by ID
export const getMediaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const media = await prisma.media.findUnique({
      where: { id },
      include: {
        article: {
          select: {
            id: true,
            slug: true,
            translations: {
              select: {
                language: true,
                title: true,
              },
            },
          },
        },
      },
    });

    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }

    res.json(media);
  } catch (error) {
    logger.error('Error fetching media:', error);
    res.status(500).json({ error: 'Failed to fetch media' });
  }
};

// Delete media
export const deleteMedia = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const media = await prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }

    // Delete file from filesystem
    const filePath = path.join(process.env.UPLOAD_DIR || './uploads', media.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete media record
    await prisma.media.delete({
      where: { id },
    });

    logger.info(`Media deleted: ${id}`);
    res.json({ message: 'Media deleted successfully' });
  } catch (error) {
    logger.error('Error deleting media:', error);
    res.status(500).json({ error: 'Failed to delete media' });
  }
};
