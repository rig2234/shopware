import { Router } from 'express';
import { getAllProducts, createProduct } from '../controllers/products.controller.js';
import multer from 'multer';
import path from 'path';

const router = Router();

const uploadDir = path.resolve(process.cwd(), 'backend', 'uploads');

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

export default router;