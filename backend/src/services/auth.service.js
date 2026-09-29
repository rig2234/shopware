import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const registrarUsuarioService = async ({ nombre, correo, contrasena, direccion, telefono }) => {
  // 1. Verificar si el correo ya está registrado
  const usuarioExistente = await prisma.usuario.findUnique({
    where: { correo }
  });

  if (usuarioExistente) {
    throw new Error('El correo electrónico ya se encuentra registrado');
  }

  // 2. Encriptar la contraseña
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(contrasena, salt);

  // 3. Crear el nuevo usuario (Por defecto ID_Rol = 1 "Cliente" y Estatus = "activo")
  const nuevoUsuario = await prisma.usuario.create({
    data: {
      nombre,
      correo,
      contrasena: passwordHash,
      idRol: 1, // 1 = Cliente, 2 = Administrador
      direccion: direccion || null,
      telefono: telefono || null,
      estatus: 'activo'
    },
    // Excluimos la contraseña en la respuesta por seguridad
    select: {
      idUsuario: true,
      nombre: true,
      correo: true,
      idRol: true,
      estatus: true
    }
  });

  return nuevoUsuario;
};