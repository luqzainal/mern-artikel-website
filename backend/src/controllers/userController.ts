import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();
const saltRounds = 10;

// Create a new user
export const createUser = async (req: Request, res: Response) => {
  const { name, email, password, roleId } = req.body;

  try {
    // Check if user with the same email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roleId,
        isActive: true, // Default to active
      },
      include: {
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Remove password from the returned object
    const { password: _, ...userWithoutPassword } = newUser;
    
    logger.info(`New user created: ${newUser.email}`);
    res.status(201).json(userWithoutPassword);

  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') { // Unique constraint failed
        return res.status(409).json({ message: 'Email address already in use.' });
      }
    }
    logger.error('Error creating user:', error);
    res.status(500).json({ message: 'Failed to create user' });
  }
};

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '10', role, isActive } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const where: any = {};

    if (role) {
      where.role = {
        name: role as string,
      };
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const total = await prisma.user.count({ where });

    const users = await prisma.user.findMany({
      where,
      skip,
      take,
      include: {
        role: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            articles: true,
            reviews: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      data: users,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    logger.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get user by ID
export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check if user is requesting their own info or is admin
    if (id !== req.user!.id && req.user!.roleName !== 'Admin') {
      return res.status(403).json({ error: 'Not authorized to view this user' });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
        _count: {
          select: {
            articles: true,
            reviews: true,
            comments: true,
            translations: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    logger.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Update user
export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, profilePicture } = req.body;

    // Check if user is updating their own info or is admin
    if (id !== req.user!.id && req.user!.roleName !== 'Admin') {
      return res.status(403).json({ error: 'Not authorized to update this user' });
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        profilePicture,
      },
      include: {
        role: true,
      },
    });

    logger.info(`User updated: ${user.id}`);
    res.json(user);
  } catch (error) {
    logger.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if user has articles
    const articleCount = await prisma.article.count({
      where: { authorId: id },
    });

    if (articleCount > 0) {
      return res.status(400).json({
        error: `Cannot delete user with ${articleCount} articles. Please reassign or delete the articles first.`,
      });
    }

    await prisma.user.delete({
      where: { id },
    });

    logger.info(`User deleted: ${id}`);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    logger.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// Update user role
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { roleId } = req.body;

    // Check if role exists
    const role = await prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { roleId },
      include: {
        role: true,
      },
    });

    logger.info(`User role updated: ${user.id} to ${role.name}`);
    res.json(user);
  } catch (error) {
    logger.error('Error updating user role:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
};

// Update user status (activate/deactivate)
export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: { isActive },
      include: {
        role: true,
      },
    });

    logger.info(`User status updated: ${user.id} to ${isActive ? 'active' : 'inactive'}`);
    res.json(user);
  } catch (error) {
    logger.error('Error updating user status:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
};

// Get user statistics
export const getUserStats = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            articles: true,
            reviews: true,
            comments: true,
            translations: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get published articles count
    const publishedArticles = await prisma.article.count({
      where: {
        authorId: id,
        status: 'PUBLISHED',
      },
    });

    // Get total views on user's articles
    const articles = await prisma.article.findMany({
      where: { authorId: id },
      select: { viewCount: true },
    });

    const totalViews = articles.reduce((sum, article) => sum + article.viewCount, 0);

    // Get approved comments count
    const approvedComments = await prisma.comment.count({
      where: {
        userId: id,
        isApproved: true,
      },
    });

    const stats = {
      totalArticles: user._count.articles,
      publishedArticles,
      totalViews,
      totalReviews: user._count.reviews,
      totalComments: user._count.comments,
      approvedComments,
      totalTranslations: user._count.translations,
    };

    res.json(stats);
  } catch (error) {
    logger.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Failed to fetch user statistics' });
  }
};
