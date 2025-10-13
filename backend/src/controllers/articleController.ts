import { Request, Response } from 'express';
import { PrismaClient, ArticleStatus } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

// Get all articles with pagination and filters
export const getAllArticles = async (req: AuthRequest, res: Response) => {
  try {
    const {
      page = '1',
      limit = '10',
      status = 'PUBLISHED',
      language = 'EN',
      categoryId,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const where: any = {
      status: status as ArticleStatus,
    };

    if (categoryId) {
      where.categoryId = categoryId as string;
    }

    // Count total articles
    const total = await prisma.article.count({ where });

    // Get articles
    const articles = await prisma.article.findMany({
      where,
      skip,
      take,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePicture: true,
          },
        },
        category: true,
        translations: {
          where: {
            language: language as any,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        [sortBy as string]: order,
      },
    });

    res.json({
      data: articles,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    logger.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
};

// Get article by ID
export const getArticleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { language = 'EN' } = req.query;

    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
        category: true,
        translations: {
          where: {
            language: language as any,
          },
          include: {
            translator: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        media: true,
      },
    });

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Increment view count
    await prisma.article.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    res.json(article);
  } catch (error) {
    logger.error('Error fetching article:', error);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
};

// Get article by slug
export const getArticleBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { language = 'EN' } = req.query;

    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
        category: true,
        translations: {
          where: {
            language: language as any,
          },
          include: {
            translator: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        media: true,
      },
    });

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Increment view count
    await prisma.article.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
    });

    res.json(article);
  } catch (error) {
    logger.error('Error fetching article:', error);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
};

// Create article
export const createArticle = async (req: AuthRequest, res: Response) => {
  try {
    const {
      categoryId,
      slug,
      featuredImage,
      metaDescription,
      references,
      translations,
      tagIds,
    } = req.body;

    // Check if slug already exists
    const existingArticle = await prisma.article.findUnique({
      where: { slug },
    });

    if (existingArticle) {
      return res.status(400).json({ error: 'Article with this slug already exists' });
    }

    // Create article with translations
    const article = await prisma.article.create({
      data: {
        authorId: req.user!.id,
        categoryId,
        slug,
        featuredImage,
        metaDescription,
        references,
        status: ArticleStatus.DRAFT,
        translations: {
          create: translations.map((t: any) => ({
            language: t.language,
            title: t.title,
            content: t.content,
            excerpt: t.excerpt,
          })),
        },
        tags: {
          create: tagIds?.map((tagId: string) => ({
            tagId,
          })) || [],
        },
      },
      include: {
        translations: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    logger.info(`Article created: ${article.id} by ${req.user!.email}`);
    res.status(201).json(article);
  } catch (error) {
    logger.error('Error creating article:', error);
    res.status(500).json({ error: 'Failed to create article' });
  }
};

// Update article
export const updateArticle = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      categoryId,
      slug,
      featuredImage,
      metaDescription,
      references,
      translations,
      tagIds,
    } = req.body;

    // Check if article exists
    const existingArticle = await prisma.article.findUnique({
      where: { id },
    });

    if (!existingArticle) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Check if user is author or admin
    if (existingArticle.authorId !== req.user!.id && req.user!.roleName !== 'Admin') {
      return res.status(403).json({ error: 'Not authorized to update this article' });
    }

    // Delete existing translations and tags
    await prisma.articleTranslation.deleteMany({
      where: { articleId: id },
    });

    await prisma.articleTag.deleteMany({
      where: { articleId: id },
    });

    // Update article
    const article = await prisma.article.update({
      where: { id },
      data: {
        categoryId,
        slug,
        featuredImage,
        metaDescription,
        references,
        translations: {
          create: translations.map((t: any) => ({
            language: t.language,
            title: t.title,
            content: t.content,
            excerpt: t.excerpt,
            translatorId: t.translatorId,
          })),
        },
        tags: {
          create: tagIds?.map((tagId: string) => ({
            tagId,
          })) || [],
        },
      },
      include: {
        translations: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    logger.info(`Article updated: ${article.id} by ${req.user!.email}`);
    res.json(article);
  } catch (error) {
    logger.error('Error updating article:', error);
    res.status(500).json({ error: 'Failed to update article' });
  }
};

// Delete article
export const deleteArticle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.article.delete({
      where: { id },
    });

    logger.info(`Article deleted: ${id}`);
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    logger.error('Error deleting article:', error);
    res.status(500).json({ error: 'Failed to delete article' });
  }
};

// Submit article for review
export const submitForReview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    if (article.authorId !== req.user!.id && req.user!.roleName !== 'Admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updatedArticle = await prisma.article.update({
      where: { id },
      data: { status: ArticleStatus.PENDING_REVIEW },
    });

    logger.info(`Article submitted for review: ${id}`);
    res.json(updatedArticle);
  } catch (error) {
    logger.error('Error submitting article for review:', error);
    res.status(500).json({ error: 'Failed to submit article for review' });
  }
};

// Publish article
export const publishArticle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const article = await prisma.article.update({
      where: { id },
      data: {
        status: ArticleStatus.PUBLISHED,
        publishedAt: new Date(),
      },
    });

    logger.info(`Article published: ${id}`);
    res.json(article);
  } catch (error) {
    logger.error('Error publishing article:', error);
    res.status(500).json({ error: 'Failed to publish article' });
  }
};

// Archive article
export const archiveArticle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const article = await prisma.article.update({
      where: { id },
      data: { status: ArticleStatus.ARCHIVED },
    });

    logger.info(`Article archived: ${id}`);
    res.json(article);
  } catch (error) {
    logger.error('Error archiving article:', error);
    res.status(500).json({ error: 'Failed to archive article' });
  }
};

// Get articles by category
export const getArticlesByCategory = async (req: Request, res: Response) => {
  try {
    const { categorySlug } = req.params;
    const { page = '1', limit = '10', language = 'EN' } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const where = {
      categoryId: category.id,
      status: ArticleStatus.PUBLISHED,
    };

    const total = await prisma.article.count({ where });

    const articles = await prisma.article.findMany({
      where,
      skip,
      take,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
        translations: {
          where: {
            language: language as any,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
    });

    res.json({
      data: articles,
      category,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    logger.error('Error fetching articles by category:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
};

// Get articles by tag
export const getArticlesByTag = async (req: Request, res: Response) => {
  try {
    const { tagSlug } = req.params;
    const { page = '1', limit = '10', language = 'EN' } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const tag = await prisma.tag.findUnique({
      where: { slug: tagSlug },
    });

    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    const articleTags = await prisma.articleTag.findMany({
      where: {
        tagId: tag.id,
        article: {
          status: ArticleStatus.PUBLISHED,
        },
      },
      skip,
      take,
      include: {
        article: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                profilePicture: true,
              },
            },
            translations: {
              where: {
                language: language as any,
              },
            },
            tags: {
              include: {
                tag: true,
              },
            },
          },
        },
      },
    });

    const articles = articleTags.map((at) => at.article);
    const total = await prisma.articleTag.count({
      where: {
        tagId: tag.id,
        article: {
          status: ArticleStatus.PUBLISHED,
        },
      },
    });

    res.json({
      data: articles,
      tag,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    logger.error('Error fetching articles by tag:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
};

// Get articles by author
export const getArticlesByAuthor = async (req: Request, res: Response) => {
  try {
    const { authorId } = req.params;
    const { page = '1', limit = '10', language = 'EN' } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const where = {
      authorId,
      status: ArticleStatus.PUBLISHED,
    };

    const total = await prisma.article.count({ where });

    const articles = await prisma.article.findMany({
      where,
      skip,
      take,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
        category: true,
        translations: {
          where: {
            language: language as any,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
    });

    res.json({
      data: articles,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    logger.error('Error fetching articles by author:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
};

// Search articles
export const searchArticles = async (req: Request, res: Response) => {
  try {
    const { q, page = '1', limit = '10', language = 'EN' } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    // Search in translations
    const translations = await prisma.articleTranslation.findMany({
      where: {
        AND: [
          {
            language: language as any,
          },
          {
            OR: [
              {
                title: {
                  contains: q as string,
                  mode: 'insensitive',
                },
              },
              {
                content: {
                  contains: q as string,
                  mode: 'insensitive',
                },
              },
              {
                excerpt: {
                  contains: q as string,
                  mode: 'insensitive',
                },
              },
            ],
          },
        ],
      },
      include: {
        article: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                profilePicture: true,
              },
            },
            category: true,
            tags: {
              include: {
                tag: true,
              },
            },
          },
        },
      },
      skip,
      take,
    });

    const articles = translations
      .filter((t: any) => t.article !== null)
      .map((t: any) => ({
        ...(t.article as any),
        translations: [t],
      }));

    const total = await prisma.articleTranslation.count({
      where: {
        AND: [
          {
            language: language as any,
          },
          {
            OR: [
              {
                title: {
                  contains: q as string,
                  mode: 'insensitive',
                },
              },
              {
                content: {
                  contains: q as string,
                  mode: 'insensitive',
                },
              },
            ],
          },
        ],
        article: {
          status: ArticleStatus.PUBLISHED,
        },
      },
    });

    res.json({
      data: articles,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    logger.error('Error searching articles:', error);
    res.status(500).json({ error: 'Failed to search articles' });
  }
};
