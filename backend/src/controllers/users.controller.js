import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.usuario.findMany({
      include: {
        rol: true
      },
      orderBy: {
        idUsuario: 'asc'
      }
    });

    res.json(users);
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor al cargar usuarios' });
  }
};