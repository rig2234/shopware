import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllProducts = async (req, res) => {
  try {
    // Consulta a la tabla "productos" usando Prisma
    const products = await prisma.producto.findMany();
    res.json(products);
  } catch (error) {
    console.error("Error obteniendo productos:", error);
    res.status(500).json({ error: 'Error interno del servidor al cargar productos' });
  }
};