import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const usuarioSeguro = {
  idUsuario: true,
  nombre: true,
  correo: true,
  idRol: true,
  direccion: true,
  telefono: true,
  estatus: true,
  rol: {
    select: {
      idRol: true,
      nombreRol: true
    }
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.usuario.findMany({
      select: usuarioSeguro,
      orderBy: { idUsuario: 'asc' }
    })

    return res.json(users)
  } catch (error) {
    console.error('Error obteniendo usuarios:', error)
    return res.status(500).json({ error: 'Error al cargar usuarios' })
  }
}

export const getAllRoles = async (req, res) => {
  try {
    const roles = await prisma.rol.findMany({
      select: {
        idRol: true,
        nombreRol: true
      },
      orderBy: { idRol: 'asc' }
    })

    return res.json(roles)
  } catch (error) {
    console.error('Error obteniendo roles:', error)
    return res.status(500).json({ error: 'Error al cargar roles' })
  }
}

export const createUser = async (req, res) => {
  try {
    const nombre = String(req.body.nombre || '').trim()
    const correo = String(req.body.correo || '').trim().toLowerCase()
    const contrasena = String(req.body.contrasena || '')
    const idRol = Number(req.body.idRol)
    const estatus = String(req.body.estatus || 'activo').trim()

    if (!nombre || !correo || !contrasena || !Number.isInteger(idRol)) {
      return res.status(400).json({
        error: 'Nombre, correo, contraseña y rol son obligatorios'
      })
    }

    if (contrasena.length < 8) {
      return res.status(400).json({
        error: 'La contraseña debe tener al menos 8 caracteres'
      })
    }

    const rol = await prisma.rol.findUnique({ where: { idRol } })
    if (!rol) {
      return res.status(400).json({ error: 'El rol seleccionado no existe' })
    }

    const contrasenaHash = await bcrypt.hash(contrasena, 10)

    const user = await prisma.usuario.create({
      data: {
        nombre,
        correo,
        contrasena: contrasenaHash,
        idRol,
        estatus
      },
      select: usuarioSeguro
    })

    return res.status(201).json(user)
  } catch (error) {
    if (error?.code === 'P2002') {
      return res.status(409).json({ error: 'Ese correo ya está registrado' })
    }

    console.error('Error creando usuario:', error)
    return res.status(500).json({ error: 'Error al crear el usuario' })
  }
}

export const updateUser = async (req, res) => {
  try {
    const idUsuario = Number(req.params.id)
    const nombre = String(req.body.nombre || '').trim()
    const correo = String(req.body.correo || '').trim().toLowerCase()
    const idRol = Number(req.body.idRol)
    const estatus = String(req.body.estatus || '').trim()
    const contrasena = String(req.body.contrasena || '')

    if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
      return res.status(400).json({ error: 'ID de usuario inválido' })
    }

    if (!nombre || !correo || !Number.isInteger(idRol) || !estatus) {
      return res.status(400).json({
        error: 'Nombre, correo, rol y estado son obligatorios'
      })
    }

    if (contrasena && contrasena.length < 8) {
      return res.status(400).json({
        error: 'La contraseña debe tener al menos 8 caracteres'
      })
    }

    const rol = await prisma.rol.findUnique({ where: { idRol } })
    if (!rol) {
      return res.status(400).json({ error: 'El rol seleccionado no existe' })
    }

    const data = { nombre, correo, idRol, estatus }

    // Si se deja vacío, conserva la contraseña actual.
    if (contrasena) {
      data.contrasena = await bcrypt.hash(contrasena, 10)
    }

    const user = await prisma.usuario.update({
      where: { idUsuario },
      data,
      select: usuarioSeguro
    })

    return res.json(user)
  } catch (error) {
    if (error?.code === 'P2002') {
      return res.status(409).json({ error: 'Ese correo ya está registrado' })
    }

    if (error?.code === 'P2025') {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    console.error('Error actualizando usuario:', error)
    return res.status(500).json({ error: 'Error al actualizar el usuario' })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const idUsuario = Number(req.params.id)

    if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
      return res.status(400).json({ error: 'ID de usuario inválido' })
    }

    // Evita que el administrador elimine su propia cuenta desde el panel.
    if (Number(req.usuario?.idUsuario) === idUsuario) {
      return res.status(400).json({
        error: 'No puedes eliminar tu propia cuenta desde el panel'
      })
    }

    // Conserva los pedidos y facturas históricos; no borra esos registros en cascada.
    const [pedidos, facturas] = await Promise.all([
      prisma.pedido.count({ where: { idUsuario } }),
      prisma.factura.count({ where: { idUsuario } })
    ])

    if (pedidos > 0 || facturas > 0) {
      return res.status(409).json({
        error: 'No se puede eliminar este usuario porque tiene pedidos o facturas asociados'
      })
    }

    await prisma.$transaction(async (tx) => {
      await tx.actividadSesion.deleteMany({ where: { idUsuario } })
      await tx.usuario.delete({ where: { idUsuario } })
    })

    return res.json({ message: 'Usuario eliminado correctamente' })
  } catch (error) {
    if (error?.code === 'P2025') {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    console.error('Error eliminando usuario:', error)
    return res.status(500).json({ error: 'Error al eliminar el usuario' })
  }
}