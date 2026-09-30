import jwt from 'jsonwebtoken';

// 1. Validar que la petición incluya un Token JWT válido
export const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token.' });
  }

  try {
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'secret_key_shopware_2026'
    );
    req.usuario = decoded; // Adjunta los datos del token (idUsuario, correo, idRol) a la req
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido o expirado.' });
  }
};

// 2. Verificar si el usuario tiene el rol requerido (ej: Administrador)
export const esAdmin = (req, res, next) => {
  if (req.usuario && req.usuario.idRol === 2) {
    next();
  } else {
    return res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de administrador.' });
  }
};