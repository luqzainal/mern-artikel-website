import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Get total articles
    const totalArticles = await prisma.article.count();

    // Get total users
    const totalUsers = await prisma.user.count();

    // Get pending reviews (articles in REVIEW status)
    const pendingReviews = await prisma.article.count({
      where: {
        status: {
          in: ['PENDING_REVIEW', 'IN_REVIEW']
        }
      },
    });

    // Get total views (sum of all article viewCount)
    const viewsData = await prisma.article.aggregate({
      _sum: { viewCount: true },
    });
    const totalViews = viewsData._sum.viewCount || 0;

    // Get total comments
    const totalComments = await prisma.comment.count();

    // Get total categories
    const totalCategories = await prisma.category.count();

    // Get articles this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const articlesThisMonth = await prisma.article.count({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
      },
    });

    // Get views this month (we'll just calculate a percentage for now)
    const viewsThisMonth = Math.floor(totalViews * 0.25); // Mock: 25% of total views

    res.json({
      totalArticles,
      totalUsers,
      pendingReviews,
      totalViews,
      totalComments,
      totalCategories,
      articlesThisMonth,
      viewsThisMonth,
    });
  } catch (error) {
    logger.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
};

export const getArticlesByCategory = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { articles: true },
        },
      },
      orderBy: {
        nameEn: 'asc',
      },
    });

    const chartData = categories.map((category) => ({
      name: category.nameEn,
      value: category._count.articles,
    }));

    res.json(chartData);
  } catch (error) {
    logger.error('Error fetching articles by category:', error);
    res.status(500).json({ error: 'Failed to fetch category statistics' });
  }
};

export const getArticlesByStatus = async (req: Request, res: Response) => {
  try {
    const statuses = ['DRAFT', 'IN_REVIEW', 'PUBLISHED', 'ARCHIVED'];

    const statusCounts = await Promise.all(
      statuses.map(async (status) => {
        const count = await prisma.article.count({
          where: { status: status as any },
        });
        return { name: status, value: count };
      })
    );

    res.json(statusCounts);
  } catch (error) {
    logger.error('Error fetching articles by status:', error);
    res.status(500).json({ error: 'Failed to fetch status statistics' });
  }
};

export const getRecentActivities = async (req: Request, res: Response) => {
  try {
    // Get recent articles with author info
    const recentArticles = await prisma.article.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: {
              select: {
                name: true,
              },
            },
            isActive: true,
            createdAt: true,
          },
        },
        translations: {
          where: {
            language: 'EN',
          },
          select: {
            title: true,
          },
          take: 1,
        },
      },
    });

    const activities = recentArticles.map((article) => ({
      id: article.id,
      userId: article.authorId,
      action: article.status === 'PUBLISHED' ? 'publish' : 'create',
      entityType: 'article',
      entityId: article.id,
      description: `${article.status === 'PUBLISHED' ? 'published' : 'created'} article "${article.translations[0]?.title || 'Untitled'}"`,
      timestamp: article.createdAt.toISOString(),
      user: {
        id: article.author.id,
        name: article.author.name,
        email: article.author.email,
        role: article.author.role.name.toLowerCase(),
        isActive: article.author.isActive,
        createdAt: article.author.createdAt.toISOString(),
      },
    }));

    res.json(activities);
  } catch (error) {
    logger.error('Error fetching recent activities:', error);
    res.status(500).json({ error: 'Failed to fetch recent activities' });
  }
};
