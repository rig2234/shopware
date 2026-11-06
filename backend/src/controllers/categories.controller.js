import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const obtenerPadrePermitido = async (parentId) => {
  if (!Number.isInteger(parentId) || parentId <= 0) {
    return null
  }

  const padre = await prisma.categoria.findUnique({
    where: { idCategoria: parentId }
  })

  if (!padre || padre.parentId !== null) {
    return null
  }

  const nombre = String(padre.nombre || '').trim().toLowerCase()
  return ['hombre', 'mujer'].includes(nombre) ? padre : null
}

export const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.categoria.findMany({
      include: {
        parent: true,
        subcategorias: true,
        productos: {
          select: { idProducto: true }
        }
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

    const parent = await obtenerPadrePermitido(parentId)
    if (!parent) {
      return res.status(400).json({
        error: 'Selecciona una categoría raíz válida: Hombre o Mujer'
      })
    }

    const category = await prisma.categoria.create({
      data: { nombre, parentId },
      include: {
        parent: true,
        subcategorias: true,
        productos: { select: { idProducto: true } }
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

export const updateCategory = async (req, res) => {
  try {
    const idCategoria = Number(req.params.id)
    const nombre = String(req.body.nombre || '').trim()
    const parentId = Number(req.body.parentId)

    if (!Number.isInteger(idCategoria) || idCategoria <= 0) {
      return res.status(400).json({ error: 'ID de categoría inválido' })
    }

    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es obligatorio' })
    }

    const actual = await prisma.categoria.findUnique({
      where: { idCategoria }
    })

    if (!actual) {
      return res.status(404).json({ error: 'Categoría no encontrada' })
    }

    // Hombre y Mujer son las categorías raíz de la jerarquía.
    // Se editan sus subcategorías, no las categorías raíz desde este formulario.
    if (actual.parentId === null) {
      return res.status(400).json({
        error: 'Las categorías raíz Hombre y Mujer no se pueden editar desde aquí'
      })
    }

    if (parentId === idCategoria) {
      return res.status(400).json({
        error: 'Una categoría no puede ser su propio padre'
      })
    }

    const parent = await obtenerPadrePermitido(parentId)
    if (!parent) {
      return res.status(400).json({
        error: 'Selecciona una categoría raíz válida: Hombre o Mujer'
      })
    }

    const category = await prisma.categoria.update({
      where: { idCategoria },
      data: { nombre, parentId },
      include: {
        parent: true,
        subcategorias: true,
        productos: { select: { idProducto: true } }
      }
    })

    return res.json({
      ...category,
      nombreCompleto: `${parent.nombre} / ${category.nombre}`
    })
  } catch (error) {
    console.error('Error actualizando categoría:', error)

    if (error?.code === 'P2025') {
      return res.status(404).json({ error: 'Categoría no encontrada' })
    }

    return res.status(500).json({
      error: 'Error interno del servidor al actualizar la categoría'
    })
  }
}

export const deleteCategory = async (req, res) => {
  try {
    const idCategoria = Number(req.params.id)

    if (!Number.isInteger(idCategoria) || idCategoria <= 0) {
      return res.status(400).json({ error: 'ID de categoría inválido' })
    }

    const category = await prisma.categoria.findUnique({
      where: { idCategoria },
      include: {
        subcategorias: {
          select: { idCategoria: true }
        }
      }
    })

    if (!category) {
      return res.status(404).json({ error: 'Categoría no encontrada' })
    }

    if (category.subcategorias.length > 0) {
      return res.status(409).json({
        error: 'No se puede eliminar esta categoría mientras tenga subcategorías'
      })
    }

    await prisma.$transaction(async (tx) => {
      // Los productos que usaban esta categoría quedan sin categoría.
      await tx.producto.updateMany({
        where: { categoriaId: idCategoria },
        data: { categoriaId: null }
      })

      await tx.categoria.delete({
        where: { idCategoria }
      })
    })

    return res.json({
      message: 'Categoría eliminada. Sus productos quedaron sin categoría.',
      idCategoria
    })
  } catch (error) {
    console.error('Error eliminando categoría:', error)

    if (error?.code === 'P2025') {
      return res.status(404).json({ error: 'Categoría no encontrada' })
    }

    return res.status(500).json({
      error: 'Error interno del servidor al eliminar la categoría'
    })
  }
}