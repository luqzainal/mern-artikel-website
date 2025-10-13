import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

const prisma = new PrismaClient();

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback',
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        // Check if user exists
        let user = await prisma.user.findUnique({
          where: { googleId: profile.id },
          include: { role: true },
        });

        if (!user) {
          // Check if user exists with same email
          user = await prisma.user.findUnique({
            where: { email: profile.emails?.[0].value },
            include: { role: true },
          });

          if (user) {
            // Update existing user with Google ID
            user = await prisma.user.update({
              where: { id: user.id },
              data: {
                googleId: profile.id,
                profilePicture: profile.photos?.[0].value,
              },
              include: { role: true },
            });
          } else {
            // Get or create Reader role
            let readerRole = await prisma.role.findUnique({
              where: { name: 'Reader' },
            });

            if (!readerRole) {
              readerRole = await prisma.role.create({
                data: {
                  name: 'Reader',
                  description: 'Can read and comment on articles',
                  permissions: JSON.stringify(['read', 'comment']),
                },
              });
            }

            // Create new user
            user = await prisma.user.create({
              data: {
                email: profile.emails?.[0].value || '',
                name: profile.displayName,
                googleId: profile.id,
                profilePicture: profile.photos?.[0].value,
                roleId: readerRole.id,
              },
              include: { role: true },
            });

            logger.info(`New user created: ${user.email}`);
          }
        }

        done(null, user);
      } catch (error) {
        logger.error('Error in Google OAuth:', error);
        done(error as Error, undefined);
      }
    }
  )
);

export default passport;
