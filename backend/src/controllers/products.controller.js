import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

const parseTallas = (raw) => {
  if (!raw) return []

  let parsed = raw

  if (typeof raw === 'string') {
    try {
      parsed = JSON.parse(raw)
    } catch {
      return []
    }
  }

  if (!Array.isArray(parsed)) return []

  return parsed
    .filter((item) => item && Number(item.idTalla))
    .map((item) => ({
      idTalla: Number(item.idTalla),
      stock: Number(item.stock ?? 0)
    }))
}

const parseDescuento = (raw) => {
  if (raw === undefined || raw === null || raw === '') return 0
  return Number(raw)
}

const descuentoValido = (descuento) =>
  Number.isFinite(descuento) && descuento >= 0 && descuento <= 100

const parseCategoriaId = (raw) => {
  if (raw === undefined || raw === null || raw === '') return null

  const id = Number(raw)
  return Number.isInteger(id) && id > 0 ? id : NaN
}

const incluirDatosProducto = {
  categoria: true,
  tallas: { include: { talla: true } }
}

export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.producto.findMany({
      include: incluirDatosProducto
    })

    return res.json(products)
  } catch (error) {
    console.error('Error obteniendo productos:', error)
    return res.status(500).json({
      error: 'Error interno del servidor al cargar productos'
    })
  }
}

// Ajuste de secuencia si PostgreSQL intenta reutilizar un id_producto.
async function fixProductoSequence() {
  const sql = `
    SELECT setval(
      pg_get_serial_sequence('productos', 'id_producto'),
      (SELECT COALESCE(MAX(id_producto), 0) FROM productos)
    )
  `

  return prisma.$queryRawUnsafe(sql)
}

const guardarTallasProducto = async (client, idProducto, tallas) => {
  for (const talla of tallas) {
    if (!Number.isInteger(talla.idTalla) || talla.idTalla <= 0) continue

    await client.productoTalla.upsert({
      where: {
        unique_producto_talla: {
          idProducto,
          idTalla: talla.idTalla
        }
      },
      update: {
        stock: talla.stock
      },
      create: {
        idProducto,
        idTalla: talla.idTalla,
        stock: talla.stock
      }
    })
  }
}

const prepararImagen = (req) => {
  if (req.file) return `/uploads/${req.file.filename}`
  if (req.body.imagen) return req.body.imagen
  return null
}

const datosRelacionCategoria = (categoriaId) => {
  if (categoriaId === null) return {}

  return {
    categoria: {
      connect: { idCategoria: categoriaId }
    }
  }
}

export const createProduct = async (req, res) => {
  try {
    const { nombre, precio } = req.body
    const categoriaId = parseCategoriaId(req.body.categoriaId)
    const descuento = parseDescuento(req.body.descuento)
    const tallas = parseTallas(req.body.tallas)
    const imagen = prepararImagen(req)

    if (!nombre || !String(nombre).trim()) {
      return res.status(400).json({
        error: 'El nombre del producto es obligatorio'
      })
    }

    if (Number.isNaN(categoriaId)) {
      return res.status(400).json({
        error: 'La categoría no es válida'
      })
    }

    if (!descuentoValido(descuento)) {
      return res.status(400).json({
        error: 'El descuento debe ser un porcentaje entre 0 y 100'
      })
    }

    const precioNumerico =
      precio !== '' && precio !== undefined && precio !== null
        ? Number(precio)
        : null

    if (
      precioNumerico !== null &&
      (!Number.isFinite(precioNumerico) || precioNumerico < 0)
    ) {
      return res.status(400).json({
        error: 'El precio no es válido'
      })
    }

    const product = await prisma.producto.create({
      data: {
        nombre: String(nombre).trim(),
        precio: precioNumerico,
        descuento,
        ...datosRelacionCategoria(categoriaId),
        imagen
      }
    })

    await guardarTallasProducto(prisma, product.idProducto, tallas)

    const created = await prisma.producto.findUnique({
      where: { idProducto: product.idProducto },
      include: incluirDatosProducto
    })

    return res.status(201).json(created)
  } catch (error) {
    console.error('Error creando producto:', error)

    if (
      error?.code === 'P2002' &&
      String(error?.meta?.target).includes('id_producto')
    ) {
      try {
        console.warn(
          'P2002 detectado en id_producto; intentando corregir secuencia y reintentar'
        )

        await fixProductoSequence()

        const { nombre, precio } = req.body
        const categoriaId = parseCategoriaId(req.body.categoriaId)
        const descuento = parseDescuento(req.body.descuento)
        const tallas = parseTallas(req.body.tallas)
        const imagen = prepararImagen(req)

        if (!nombre || !String(nombre).trim()) {
          return res.status(400).json({
            error: 'El nombre del producto es obligatorio'
          })
        }

        if (Number.isNaN(categoriaId)) {
          return res.status(400).json({
            error: 'La categoría no es válida'
          })
        }

        if (!descuentoValido(descuento)) {
          return res.status(400).json({
            error: 'El descuento debe ser un porcentaje entre 0 y 100'
          })
        }

        const precioNumerico =
          precio !== '' && precio !== undefined && precio !== null
            ? Number(precio)
            : null

        if (
          precioNumerico !== null &&
          (!Number.isFinite(precioNumerico) || precioNumerico < 0)
        ) {
          return res.status(400).json({
            error: 'El precio no es válido'
          })
        }

        const product = await prisma.producto.create({
          data: {
            nombre: String(nombre).trim(),
            precio: precioNumerico,
            descuento,
            ...datosRelacionCategoria(categoriaId),
            imagen
          }
        })

        await guardarTallasProducto(prisma, product.idProducto, tallas)

        const created = await prisma.producto.findUnique({
          where: { idProducto: product.idProducto },
          include: incluirDatosProducto
        })

        return res.status(201).json(created)
      } catch (retryError) {
        console.error('Reintento fallido al crear producto:', retryError)
        return res.status(500).json({
          error: 'Error al crear producto (reintento fallido)',
          detail: retryError.message || String(retryError)
        })
      }
    }

    if (error?.code === 'P2025') {
      return res.status(400).json({
        error: 'La categoría indicada no existe'
      })
    }

    return res.status(500).json({
      error: 'Error interno del servidor al crear producto',
      detail: error.message || String(error)
    })
  }
}

export const updateProduct = async (req, res) => {
  try {
    const id = Number(req.params.id)

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: 'ID de producto inválido'
      })
    }

    const nombre = String(req.body.nombre || '').trim()

    const precio =
      req.body.precio === '' ||
      req.body.precio === undefined ||
      req.body.precio === null
        ? null
        : Number(req.body.precio)

    const categoriaId = parseCategoriaId(req.body.categoriaId)

    // Si no viene el campo descuento, conserva el descuento actual.
    const descuento =
      req.body.descuento === undefined
        ? undefined
        : parseDescuento(req.body.descuento)

    const tallas = parseTallas(req.body.tallas)

    if (!nombre) {
      return res.status(400).json({
        error: 'El nombre del producto es obligatorio'
      })
    }

    if (precio !== null && (!Number.isFinite(precio) || precio < 0)) {
      return res.status(400).json({
        error: 'El precio no es válido'
      })
    }

    if (Number.isNaN(categoriaId)) {
      return res.status(400).json({
        error: 'La categoría no es válida'
      })
    }

    if (descuento !== undefined && !descuentoValido(descuento)) {
      return res.status(400).json({
        error: 'El descuento debe ser un porcentaje entre 0 y 100'
      })
    }

    if (!tallas.length) {
      return res.status(400).json({
        error: 'Selecciona al menos una talla'
      })
    }

    const productoActualizado = await prisma.$transaction(async (tx) => {
      const existente = await tx.producto.findUnique({
        where: { idProducto: id },
        select: { idProducto: true }
      })

      if (!existente) {
        const error = new Error('Producto no encontrado')
        error.status = 404
        throw error
      }

      const imagen = req.file
        ? `/uploads/${req.file.filename}`
        : undefined

      await tx.producto.update({
        where: { idProducto: id },
        data: {
          nombre,
          precio,
          ...(categoriaId === null
            ? { categoria: { disconnect: true } }
            : {
                categoria: {
                  connect: { idCategoria: categoriaId }
                }
              }),
          ...(descuento !== undefined ? { descuento } : {}),
          ...(imagen ? { imagen } : {})
        }
      })

      const idsTalla = tallas.map((talla) => talla.idTalla)

      await tx.productoTalla.updateMany({
        where: {
          idProducto: id,
          idTalla: { notIn: idsTalla }
        },
        data: { stock: 0 }
      })

      await guardarTallasProducto(tx, id, tallas)

      return tx.producto.findUnique({
        where: { idProducto: id },
        include: incluirDatosProducto
      })
    })

    return res.json(productoActualizado)
  } catch (error) {
    console.error('Error actualizando producto:', error)

    if (error?.code === 'P2025') {
      return res.status(400).json({
        error: 'El producto o la categoría indicada no existe'
      })
    }

    return res.status(error.status || 500).json({
      error: error.message || 'Error al actualizar producto'
    })
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const id = Number(req.params.id)

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: 'ID de producto inválido'
      })
    }

    const product = await prisma.producto.findUnique({
      where: { idProducto: id }
    })

    if (!product) {
      return res.status(404).json({
        error: 'Producto no encontrado'
      })
    }

    if (product.imagen && !product.imagen.startsWith('http')) {
      const relativePath = product.imagen.replace(/^\/+/, '')
      const filePath = path.resolve(process.cwd(), 'backend', relativePath)

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    }

    await prisma.productoTalla.deleteMany({
      where: { idProducto: id }
    })

    await prisma.producto.delete({
      where: { idProducto: id }
    })

    return res.json({
      message: 'Producto eliminado correctamente',
      id
    })
  } catch (error) {
    console.error('Error eliminando producto:', error)
    return res.status(500).json({
      error: 'Error al eliminar producto',
      detail: error.message || String(error)
    })
  }
}