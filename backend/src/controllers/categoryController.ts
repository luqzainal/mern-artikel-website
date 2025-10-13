import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

// Get all categories
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            articles: {
              where: {
                status: 'PUBLISHED',
              },
            },
          },
        },
      },
      orderBy: {
        nameEn: 'asc',
      },
    });

    res.json(categories);
  } catch (error) {
    logger.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// Get category by ID
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            articles: {
              where: {
                status: 'PUBLISHED',
              },
            },
          },
        },
      },
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    logger.error('Error fetching category:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
};

// Get category by slug
export const getCategoryBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            articles: {
              where: {
                status: 'PUBLISHED',
              },
            },
          },
        },
      },
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    logger.error('Error fetching category:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
};

// Create category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { nameEn, nameMy, slug, description } = req.body;

    // Check if slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return res.status(400).json({ error: 'Category with this slug already exists' });
    }

    const category = await prisma.category.create({
      data: {
        nameEn,
        nameMy,
        slug,
        description,
      },
    });

    logger.info(`Category created: ${category.id}`);
    res.status(201).json(category);
  } catch (error) {
    logger.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
};

// Update category
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nameEn, nameMy, slug, description } = req.body;

    const category = await prisma.category.update({
      where: { id },
      data: {
        nameEn,
        nameMy,
        slug,
        description,
      },
    });

    logger.info(`Category updated: ${category.id}`);
    res.json(category);
  } catch (error) {
    logger.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
};

// Delete category
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if category has articles
    const articleCount = await prisma.article.count({
      where: { categoryId: id },
    });

    if (articleCount > 0) {
      return res.status(400).json({
        error: `Cannot delete category with ${articleCount} articles. Please reassign or delete the articles first.`,
      });
    }

    await prisma.category.delete({
      where: { id },
    });

    logger.info(`Category deleted: ${id}`);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    logger.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
};
