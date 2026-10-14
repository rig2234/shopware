import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllTallas = async (req, res) => {
  try {
    const tallas = await prisma.talla.findMany({ orderBy: { orden: 'asc' } });
    res.json(tallas);
  } catch (error) {
    console.error('Error obteniendo tallas:', error);
    res.status(500).json({ error: 'Error interno del servidor al cargar tallas' });
  }
};