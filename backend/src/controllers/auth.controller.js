import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, correo, contrasena } = req.body;

    // 1. Validar campos obligatorios
    if (!nombre || !correo || !contrasena) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // 2. Verificar si el correo ya existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { correo }
    });

    if (usuarioExistente) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }

    // 3. Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const contrasenaHash = await bcrypt.hash(contrasena, salt);

    // 4. Crear el usuario asignándole automáticamente el idRol = 1 (Cliente)
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre,
        correo,
        contrasena: contrasenaHash,
        idRol: 1 // <--- Se asigna automáticamente el rol de Cliente
      }
    });

    return res.status(201).json({
      message: 'Usuario registrado exitosamente',
      usuario: {
        id: nuevoUsuario.idUsuario,
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo,
        idRol: nuevoUsuario.idRol
      }
    });

  } catch (error) {
    console.error('Error en registrarUsuario:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};