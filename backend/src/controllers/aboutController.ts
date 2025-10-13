import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get About page content
export const getAboutPage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get the first (and should be only) about page record
    const aboutPage = await prisma.aboutPage.findFirst();

    if (!aboutPage) {
      res.status(404).json({ error: 'About page not found' });
      return;
    }

    res.json(aboutPage);
  } catch (error) {
    next(error);
  }
};

// Update About page content (Admin only)
export const updateAboutPage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      titleEn,
      titleMy,
      descriptionEn,
      descriptionMy,
      missionEn,
      missionMy,
      visionEn,
      visionMy,
      valuesEn,
      valuesMy,
    } = req.body;

    // Get existing about page
    const existingPage = await prisma.aboutPage.findFirst();

    let aboutPage;

    if (existingPage) {
      // Update existing page
      aboutPage = await prisma.aboutPage.update({
        where: { id: existingPage.id },
        data: {
          titleEn,
          titleMy,
          descriptionEn,
          descriptionMy,
          missionEn,
          missionMy,
          visionEn,
          visionMy,
          valuesEn,
          valuesMy,
        },
      });
    } else {
      // Create new page if doesn't exist
      aboutPage = await prisma.aboutPage.create({
        data: {
          titleEn,
          titleMy,
          descriptionEn,
          descriptionMy,
          missionEn,
          missionMy,
          visionEn,
          visionMy,
          valuesEn,
          valuesMy,
        },
      });
    }

    res.json(aboutPage);
  } catch (error) {
    next(error);
  }
};

