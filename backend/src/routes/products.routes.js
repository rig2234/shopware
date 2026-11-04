import { Router } from 'express';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/products.controller.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

const resolveUploadsDir = () => {
  const candidates = [
    path.resolve(process.cwd(), 'uploads'),
    path.resolve(process.cwd(), 'backend', 'uploads'),
    path.resolve(process.cwd(), 'backend', 'src', 'uploads')
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }

  return path.resolve(process.cwd(), 'uploads');
};

const uploadDir = resolveUploadsDir();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_/]/g, '_');
    cb(null, `${unique}-${safeName}`);
  }
});

const upload = multer({ storage });

router.get('/', getAllProducts);
router.post('/', upload.single('imagen'), createProduct);
router.put('/:id', upload.single('imagen'), updateProduct);
router.delete('/:id', deleteProduct);

export default router;