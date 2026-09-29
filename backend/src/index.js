import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas API
app.use('/api/auth', authRoutes);

// Ruta de comprobación de salud del servidor
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor Backend activo' });
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});