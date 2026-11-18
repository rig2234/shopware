import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const calcularPrecioFinal = (producto) => {
  const precio = Number(producto.precio)
  const descuento = Number(producto.descuento) || 0

  if (!Number.isFinite(precio) || precio < 0) return 0
  return Number((precio * (1 - descuento / 100)).toFixed(2))
}

export const getCart = async (req, res) => {
  try {
    const items = await prisma.carrito.findMany({
      where: { idUsuario: req.usuario.idUsuario },
      include: {
        producto: true,
        productoTalla: {
          include: { talla: true }
        }
      },
      orderBy: { fechaAgregado: 'desc' }
    })

    const carrito = items.map((item) => {
      const precioUnitario = item.producto
        ? calcularPrecioFinal(item.producto)
        : 0

      return {
        ...item,
        precioUnitario,
        subtotal: Number((precioUnitario * item.cantidad).toFixed(2))
      }
    })

    return res.json(carrito)
  } catch (error) {
    console.error('Error obteniendo carrito:', error)
    return res.status(500).json({ message: 'No se pudo cargar el carrito' })
  }
}

export const addToCart = async (req, res) => {
  try {
    const idProducto = Number(req.body.idProducto)
    const idProductoTalla = Number(req.body.idProductoTalla)
    const cantidad = Number(req.body.cantidad ?? 1)
    const idUsuario = req.usuario.idUsuario

    if (!Number.isInteger(idProducto) || idProducto <= 0) {
      return res.status(400).json({ message: 'El producto no es válido' })
    }

    if (!Number.isInteger(idProductoTalla) || idProductoTalla <= 0) {
      return res.status(400).json({ message: 'Selecciona una talla' })
    }

    if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 99) {
      return res.status(400).json({
        message: 'La cantidad debe estar entre 1 y 99'
      })
    }

    const producto = await prisma.producto.findUnique({
      where: { idProducto }
    })

    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' })
    }

    const productoTalla = await prisma.productoTalla.findFirst({
      where: {
        idProductoTalla,
        idProducto
      },
      include: { talla: true }
    })

    if (!productoTalla) {
      return res.status(400).json({
        message: 'La talla seleccionada no corresponde a este producto'
      })
    }

    const stock = Number(productoTalla.stock ?? 0)

    if (stock <= 0) {
      return res.status(400).json({
        message: 'Esta talla no tiene stock disponible'
      })
    }

    const itemExistente = await prisma.carrito.findFirst({
      where: {
        idUsuario,
        idProducto,
        idProductoTalla
      }
    })

    const cantidadFinal = (itemExistente?.cantidad ?? 0) + cantidad

    if (cantidadFinal > stock) {
      return res.status(400).json({
        message: `Solo quedan ${stock} unidades disponibles en esta talla`
      })
    }

    const precio = Number(producto.precio)
    const descuento = Number(producto.descuento) || 0
    const precioUnitario = Number(
      (precio * (1 - descuento / 100)).toFixed(2)
    )
    const total = Number((precioUnitario * cantidadFinal).toFixed(2))

    const item = itemExistente
      ? await prisma.carrito.update({
          where: { idCarrito: itemExistente.idCarrito },
          data: { cantidad: cantidadFinal, total }
        })
      : await prisma.carrito.create({
          data: {
            idUsuario,
            idProducto,
            idProductoTalla,
            cantidad,
            total: Number((precioUnitario * cantidad).toFixed(2))
          }
        })

    return res.status(201).json({
      message: 'Producto agregado al carrito',
      item
    })
  } catch (error) {
    console.error('Error agregando al carrito:', error)
    return res.status(500).json({ message: 'No se pudo agregar el producto' })
  }
}

export const removeFromCart = async (req, res) => {
  try {
    const idCarrito = Number(req.params.id)

    if (!Number.isInteger(idCarrito) || idCarrito <= 0) {
      return res.status(400).json({ message: 'El producto del carrito no es válido' })
    }

    const resultado = await prisma.carrito.deleteMany({
      where: {
        idCarrito,
        idUsuario: req.usuario.idUsuario
      }
    })

    if (resultado.count === 0) {
      return res.status(404).json({ message: 'Producto del carrito no encontrado' })
    }

    return res.json({ message: 'Producto eliminado del carrito' })
  } catch (error) {
    console.error('Error eliminando del carrito:', error)
    return res.status(500).json({ message: 'No se pudo eliminar el producto' })
  }
}