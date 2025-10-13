import { Router } from 'express';
import passport from 'passport';
import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { authenticateToken } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = Router();

// Email/Password login (for development)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      await prisma.$disconnect();
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user has password (some users might only have Google OAuth)
    if (!user.password) {
      await prisma.$disconnect();
      return res.status(401).json({ error: 'This account uses Google login only' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      await prisma.$disconnect();
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const jwtSecret = String(process.env.JWT_SECRET || 'secret');
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      jwtSecret,
      { expiresIn: String(process.env.JWT_EXPIRES_IN || '7d') } as any
    );

    await prisma.$disconnect();

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profilePicture: user.profilePicture,
        role: {
          id: user.role.id,
          name: user.role.name,
          permissions: user.role.permissions,
        },
      },
    });
  } catch (error) {
    logger.error('Error in email/password login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Google OAuth login
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

// Google OAuth callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    try {
      const user = req.user as any;

      // Generate JWT token
      const jwtSecret = String(process.env.JWT_SECRET || 'secret');
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        jwtSecret,
        { expiresIn: String(process.env.JWT_EXPIRES_IN || '7d') } as any
      );

      // Redirect to frontend with token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
      res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
    } catch (error) {
      logger.error('Error in Google OAuth callback:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }
  }
);

// Get current user
router.get('/me', authenticateToken, async (req: any, res) => {
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        role: true,
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const responseData = {
      id: user.id,
      email: user.email,
      name: user.name,
      profilePicture: user.profilePicture,
      role: {
        id: user.role.id,
        name: user.role.name,
        permissions: user.role.permissions,
      },
      createdAt: user.createdAt,
    };

    await prisma.$disconnect();

    res.json(responseData);
  } catch (error) {
    logger.error('Error fetching current user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      logger.error('Error during logout:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// Refresh token
router.post('/refresh', authenticateToken, (req: any, res) => {
  try {
    const jwtSecret = String(process.env.JWT_SECRET || 'secret');
    const newToken = jwt.sign(
      { userId: req.user.id, email: req.user.email },
      jwtSecret,
      { expiresIn: String(process.env.JWT_EXPIRES_IN || '7d') } as any
    );

    res.json({ token: newToken });
  } catch (error) {
    logger.error('Error refreshing token:', error);
    res.status(500).json({ error: 'Token refresh failed' });
  }
});

export default router;
