import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Submit contact form
export const submitContact = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      res.status(400).json({ error: 'Name, email, and message are required' });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Invalid email format' });
      return;
    }

    // Create contact submission
    const submission = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        subject: subject || null,
        message,
      },
    });

    res.status(201).json({
      message: 'Contact submission received successfully',
      id: submission.id,
    });
  } catch (error) {
    next(error);
  }
};

// Get all contact submissions (Admin only)
export const getAllContactSubmissions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = '1', limit = '20', isRead } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {};
    if (isRead !== undefined) {
      where.isRead = isRead === 'true';
    }

    const [submissions, total] = await Promise.all([
      prisma.contactSubmission.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.contactSubmission.count({ where }),
    ]);

    res.json({
      data: submissions,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        totalPages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get single contact submission (Admin only)
export const getContactSubmission = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const submission = await prisma.contactSubmission.findUnique({
      where: { id },
    });

    if (!submission) {
      res.status(404).json({ error: 'Contact submission not found' });
      return;
    }

    res.json(submission);
  } catch (error) {
    next(error);
  }
};

// Mark contact submission as read (Admin only)
export const markAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const submission = await prisma.contactSubmission.update({
      where: { id },
      data: { isRead: true },
    });

    res.json(submission);
  } catch (error) {
    next(error);
  }
};

// Mark contact submission as replied (Admin only)
export const markAsReplied = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const submission = await prisma.contactSubmission.update({
      where: { id },
      data: { replied: true },
    });

    res.json(submission);
  } catch (error) {
    next(error);
  }
};

// Delete contact submission (Admin only)
export const deleteContactSubmission = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.contactSubmission.delete({
      where: { id },
    });

    res.json({ message: 'Contact submission deleted successfully' });
  } catch (error) {
    next(error);
  }
};

