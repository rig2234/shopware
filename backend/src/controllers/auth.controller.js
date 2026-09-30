import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { enviarCodigoVerificacion } from '../services/email.services.js';

const prisma = new PrismaClient();

// 1. Solicitar código de verificación (Guarda temporalmente)
export const solicitarVerificacion = async (req, res) => {
  try {
    const { nombre, correo, contrasena } = req.body;

    if (!nombre || !correo || !contrasena) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Comprobar si el usuario ya existe en la base de datos principal
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { correo }
    });

    if (usuarioExistente) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }

    // Hashear contraseña antes de almacenarla en verificaciones
    const salt = await bcrypt.genSalt(10);
    const contrasenaHash = await bcrypt.hash(contrasena, salt);

    // Generar código de 6 dígitos y token único
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    // Eliminar verificaciones antiguas pendientes de este mismo correo
    await prisma.verificacion.deleteMany({
      where: { correo }
    });

    // Guardar en la tabla 'verificaciones'
    await prisma.verificacion.create({
      data: {
        nombre,
        correo,
        contrasenaHash,
        token,
        codigo,
        expiresAt
      }
    });

    // Enviar el correo
    await enviarCodigoVerificacion(correo, codigo);

    return res.status(200).json({
      message: 'Código de verificación enviado al correo',
      token
    });

  } catch (error) {
    console.error('Error en solicitarVerificacion:', error);
    return res.status(500).json({ message: 'Error al enviar el código de verificación' });
  }
};

// 2. Confirmar código y mover a la tabla usuarios
export const confirmarVerificacion = async (req, res) => {
  try {
    const { token, codigo } = req.body;

    if (!token || !codigo) {
      return res.status(400).json({ message: 'El token y el código son obligatorios' });
    }

    // Buscar el registro de verificación
    const registroTemp = await prisma.verificacion.findUnique({
      where: { token }
    });

    if (!registroTemp) {
      return res.status(404).json({ message: 'Solicitud no encontrada o vencida' });
    }

    // Comprobar tiempo de expiración
    if (new Date() > new Date(registroTemp.expiresAt)) {
      await prisma.verificacion.delete({ where: { id: registroTemp.id } });
      return res.status(400).json({ message: 'El código ha expirado. Por favor, solicita uno nuevo' });
    }

    // Validar código
    if (registroTemp.codigo !== codigo.trim()) {
      return res.status(400).json({ message: 'El código ingresado es incorrecto' });
    }

    // Insertar definitivamente en la tabla 'usuarios'
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre: registroTemp.nombre,
        correo: registroTemp.correo,
        contrasena: registroTemp.contrasenaHash,
        idRol: 1, // Rol 'Cliente'
        estatus: 'activo'
      }
    });

    // Eliminar el registro temporal
    await prisma.verificacion.delete({ where: { id: registroTemp.id } });

    return res.status(201).json({
      message: 'Usuario verificado y registrado exitosamente',
      usuario: {
        id: nuevoUsuario.idUsuario,
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo
      }
    });

  } catch (error) {
    console.error('Error en confirmarVerificacion:', error);
    return res.status(500).json({ message: 'Error interno al verificar la cuenta' });
  }
};

// 3. Iniciar Sesión (Autenticación con JWT y Roles)
export const iniciarSesion = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({ message: 'El correo y la contraseña son obligatorios' });
    }

    // Buscar usuario incluyendo su rol
    const usuario = await prisma.usuario.findUnique({
      where: { correo },
      include: {
        rol: true // Asumiendo relación con la tabla de roles
      }
    });

    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    console.log('--- DEPURACIÓN LOGIN ---');
    console.log('Contraseña recibida del frontend:', contrasena);
    console.log('Hash recuperado de la BD:', usuario.contrasena);

    // Validar contraseña
    const esContrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!esContrasenaValida) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Validar estatus de la cuenta
    if (usuario.estatus !== 'activo') {
      return res.status(403).json({ message: 'Tu cuenta se encuentra inactiva o suspendida' });
    }

    // Generar Token JWT con información para el frontend y middleware de autorización
    const token = jwt.sign(
      {
        idUsuario: usuario.idUsuario,
        correo: usuario.correo,
        idRol: usuario.idRol
      },
      process.env.JWT_SECRET || 'secret_key_shopware_2026',
      { expiresIn: '8h' }
    );

    return res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      usuario: {
        idUsuario: usuario.idUsuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        idRol: usuario.idRol
      }
    });

  } catch (error) {
    console.error('Error en iniciarSesion:', error);
    return res.status(500).json({ message: 'Error interno al iniciar sesión' });
  }
};