import { registrarUsuarioService } from '../services/auth.service.js';

export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, correo, contrasena, direccion, telefono } = req.body;

    // Validación de campos obligatorios
    if (!nombre || !correo || !contrasena) {
      return res.status(400).json({
        ok: false,
        message: 'Los campos nombre, correo y contraseña son obligatorios'
      });
    }

    // Llamada al servicio
    const usuario = await registrarUsuarioService({
      nombre,
      correo,
      contrasena,
      direccion,
      telefono
    });

    return res.status(201).json({
      ok: true,
      message: 'Usuario registrado exitosamente',
      data: usuario
    });

  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error.message || 'Error al registrar el usuario'
    });
  }
};