import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

import authRoutes from './routes/auth.routes.js';
import productsRoutes from './routes/products.routes.js';
import categoriesRoutes from './routes/categories.routes.js';
import tallasRoutes from './routes/tallas.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

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

const uploadsDir = resolveUploadsDir();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/tallas', tallasRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor Backend activo' });
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
  console.log('Uploads dir:', uploadsDir);
});