import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.categoria.findMany();
    res.json(categories);
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({ error: 'Error interno del servidor al cargar categorías' });
  }
};
