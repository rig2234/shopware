import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
    })

    const formatted = categories.map((category) => ({
      ...category,
      nombreCompleto: category.parent
        ? `${category.parent.nombre} / ${category.nombre}`
        : category.nombre
    }))

    return res.json(formatted)
  } catch (error) {
    console.error('Error obteniendo categorías:', error)
    return res.status(500).json({
      error: 'Error interno del servidor al cargar categorías'
    })
  }
}

export const createCategory = async (req, res) => {
  try {
    const nombre = String(req.body.nombre || '').trim()
    const parentId = Number(req.body.parentId)

    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es obligatorio' })
    }

    if (!Number.isInteger(parentId) || parentId <= 0) {
      return res.status(400).json({
        error: 'Selecciona Hombre o Mujer como categoría padre'
      })
    }

    const parent = await prisma.categoria.findUnique({
      where: { idCategoria: parentId }
    })

    if (!parent) {
      return res.status(400).json({ error: 'La categoría padre no existe' })
    }

    const nombrePadre = String(parent.nombre || '').trim().toLowerCase()
    const esCategoriaRaiz = parent.parentId === null
    const esPadrePermitido = ['hombre', 'mujer'].includes(nombrePadre)

    if (!esCategoriaRaiz || !esPadrePermitido) {
      return res.status(400).json({
        error: 'El padre debe ser una categoría raíz llamada Hombre o Mujer'
      })
    }

    const category = await prisma.categoria.create({
      data: {
        nombre,
        parentId
      },
      include: {
        parent: true,
        subcategorias: true
      }
    })

    return res.status(201).json({
      ...category,
      nombreCompleto: `${parent.nombre} / ${category.nombre}`
    })
  } catch (error) {
    console.error('Error creando categoría:', error)
    return res.status(500).json({
      error: 'Error interno del servidor al crear la categoría'
    })
  }
}