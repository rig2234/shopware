import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth.routes.js';
import productsRoutes from './routes/products.routes.js'; // Importación de la ruta

dotenv.config();

// 1. Inicialización de la app
const app = express();
const PORT = process.env.PORT || 3000;

// 2. Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// 3. Rutas API (Ahora sí puedes usar "app" sin problemas)
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes); // <-- Endpoint habilitado en el lugar correcto

// Ruta de comprobación de salud del servidor
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor Backend activo' });
});

// 4. Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});