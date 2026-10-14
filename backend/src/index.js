import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth.routes.js';
import productsRoutes from './routes/products.routes.js'; // Importación de la ruta
import categoriesRoutes from './routes/categories.routes.js'; // Ruta para categorías
import tallasRoutes from './routes/tallas.routes.js'; // Ruta para tallas

dotenv.config();

// 1. Inicialización de la app
const app = express();
const PORT = process.env.PORT || 3000;

// 2. Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// 3. Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/tallas', tallasRoutes);

// Ruta de comprobación de salud del servidor
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor Backend activo' });
});

// 4. Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
