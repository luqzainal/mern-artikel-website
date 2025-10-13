import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { authenticateToken, requireRole } from '../middleware/auth';
import * as mediaController from '../controllers/mediaController';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_DIR || './uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  // Accept images only
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB default
  },
});

// Upload image - Author, Admin
router.post('/upload', authenticateToken, requireRole('Author', 'Admin', 'Translator'), upload.single('image'), mediaController.uploadImage);

// Get all media - Admin only
router.get('/', authenticateToken, requireRole('Admin'), mediaController.getAllMedia);

// Get media by ID
router.get('/:id', mediaController.getMediaById);

// Delete media - Admin only
router.delete('/:id', authenticateToken, requireRole('Admin'), mediaController.deleteMedia);

export default router;
