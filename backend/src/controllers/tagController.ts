import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

// Get all tags
export const getAllTags = async (req: Request, res: Response) => {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            articleTags: {
              where: {
                article: {
                  status: 'PUBLISHED',
                },
              },
            },
          },
        },
      },
      orderBy: {
        nameEn: 'asc',
      },
    });

    res.json(tags);
  } catch (error) {
    logger.error('Error fetching tags:', error);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
};

// Get tag by ID
export const getTagById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            articleTags: {
              where: {
                article: {
                  status: 'PUBLISHED',
                },
              },
            },
          },
        },
      },
    });

    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    res.json(tag);
  } catch (error) {
    logger.error('Error fetching tag:', error);
    res.status(500).json({ error: 'Failed to fetch tag' });
  }
};

// Get tag by slug
export const getTagBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const tag = await prisma.tag.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            articleTags: {
              where: {
                article: {
                  status: 'PUBLISHED',
                },
              },
            },
          },
        },
      },
    });

    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    res.json(tag);
  } catch (error) {
    logger.error('Error fetching tag:', error);
    res.status(500).json({ error: 'Failed to fetch tag' });
  }
};

// Create tag
export const createTag = async (req: Request, res: Response) => {
  try {
    const { nameEn, nameMy, slug } = req.body;

    // Check if slug already exists
    const existingTag = await prisma.tag.findUnique({
      where: { slug },
    });

    if (existingTag) {
      return res.status(400).json({ error: 'Tag with this slug already exists' });
    }

    const tag = await prisma.tag.create({
      data: {
        nameEn,
        nameMy,
        slug,
      },
    });

    logger.info(`Tag created: ${tag.id}`);
    res.status(201).json(tag);
  } catch (error) {
    logger.error('Error creating tag:', error);
    res.status(500).json({ error: 'Failed to create tag' });
  }
};

// Update tag
export const updateTag = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nameEn, nameMy, slug } = req.body;

    const tag = await prisma.tag.update({
      where: { id },
      data: {
        nameEn,
        nameMy,
        slug,
      },
    });

    logger.info(`Tag updated: ${tag.id}`);
    res.json(tag);
  } catch (error) {
    logger.error('Error updating tag:', error);
    res.status(500).json({ error: 'Failed to update tag' });
  }
};

// Delete tag
export const deleteTag = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Delete all article-tag relationships
    await prisma.articleTag.deleteMany({
      where: { tagId: id },
    });

    // Delete tag
    await prisma.tag.delete({
      where: { id },
    });

    logger.info(`Tag deleted: ${id}`);
    res.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    logger.error('Error deleting tag:', error);
    res.status(500).json({ error: 'Failed to delete tag' });
  }
};
