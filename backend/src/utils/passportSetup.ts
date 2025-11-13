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
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
      },
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy - Only setup if credentials are available
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleCallbackURL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback';

// Check if credentials are valid (not empty strings)
if (googleClientId && googleClientSecret && googleClientId.trim() !== '' && googleClientSecret.trim() !== '') {
  logger.info('Setting up Google OAuth Strategy');
  
  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientId,
        clientSecret: googleClientSecret,
        callbackURL: googleCallbackURL,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          // Check if user exists by Google ID
          let user = await prisma.user.findUnique({
            where: { googleId: profile.id },
            include: { role: true },
          });

          if (user) {
            return done(null, user);
          }

          // Check if user exists with same email
          const email = profile.emails?.[0].value;
          if (email) {
            user = await prisma.user.findUnique({
              where: { email },
              include: { role: true },
            });

            if (user) {
              // Update existing user with Google ID
              const updatedUser = await prisma.user.update({
                where: { id: user.id },
                data: {
                  googleId: profile.id,
                  profilePicture: profile.photos?.[0].value,
                },
                include: { role: true },
              });
              return done(null, updatedUser);
            }
          }

          // Get Reader role
          const readerRole = await prisma.role.findUnique({
            where: { name: 'Reader' },
          });

          if (!readerRole) {
            throw new Error('Reader role not found. Please run database setup.');
          }

          // Create new user
          const newUser = await prisma.user.create({
            data: {
              email: email || '',
              name: profile.displayName,
              googleId: profile.id,
              profilePicture: profile.photos?.[0].value,
              roleId: readerRole.id,
              isActive: true,
            },
            include: { role: true },
          });

          logger.info(`New user created via Google OAuth: ${email}`);
          done(null, newUser);
        } catch (error) {
          logger.error('Error in Google OAuth:', error);
          done(error as Error, undefined);
        }
      }
    )
  );
} else {
  logger.warn('Google OAuth credentials not found. Google login will be disabled.');
  logger.warn('Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env file to enable Google OAuth.');
}

export default passport;
