import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.categoria.findMany({
      include: {
        parent: true,
        subcategorias: true
      },
      orderBy: [
        { parentId: 'asc' },
        { nombre: 'asc' }
      ]
    });

    const formatted = categories.map(cat => ({
      ...cat,
      nombreCompleto: cat.parent
        ? `${cat.parent.nombre} / ${cat.nombre}`
        : cat.nombre
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({ error: 'Error interno del servidor al cargar categorías' });
  }
};