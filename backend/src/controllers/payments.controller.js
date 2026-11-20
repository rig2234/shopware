import { PrismaClient } from '@prisma/client'
import Stripe from 'stripe'

const prisma = new PrismaClient()

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY no está configurada')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY)
}

const calcularPrecioFinal = (producto) => {
  const precio = Number(producto.precio)
  const descuento = Number(producto.descuento) || 0
  if (!Number.isFinite(precio) || precio < 0) return 0
  return Number((precio * (1 - descuento / 100)).toFixed(2))
}

export const createPaymentIntent = async (req, res) => {
  try {
    const idUsuario = req.usuario.idUsuario
    const stripe = getStripe()

    const items = await prisma.carrito.findMany({
      where: { idUsuario },
      include: {
        producto: true,
        productoTalla: { include: { talla: true } }
      }
    })

    if (!items.length) {
      return res.status(400).json({ message: 'El carrito está vacío' })
    }

    for (const item of items) {
      if (!item.producto || !item.productoTalla) {
        return res.status(400).json({ message: 'Hay un producto no disponible en el carrito' })
      }
      if (Number(item.productoTalla.stock ?? 0) < item.cantidad) {
        return res.status(400).json({
          message: `No hay stock suficiente para ${item.producto.nombre}`
        })
      }
    }

    const total = Number(items.reduce((sum, item) => {
      return sum + calcularPrecioFinal(item.producto) * item.cantidad
    }, 0).toFixed(2))

    if (total <= 0) {
      return res.status(400).json({ message: 'El total del pago no es válido' })
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: 'mxn',
      automatic_payment_methods: { enabled: true },
      metadata: {
        idUsuario: String(idUsuario),
        tipo: 'shopware_pago_escolar'
      }
    })

    await prisma.$transaction(async (tx) => {
      await tx.pagoPendiente.create({
        data: {
          idUsuario,
          stripePaymentIntentId: paymentIntent.id,
          total,
          moneda: 'mxn',
          estado: 'PENDING',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          detalles: {
            create: items.map((item) => ({
              idProducto: item.idProducto,
              idProductoTalla: item.idProductoTalla,
              nombreProducto: item.producto.nombre || 'Producto',
              nombreTalla: item.productoTalla.talla?.nombre || 'Sin talla',
              cantidad: item.cantidad,
              precioUnitario: calcularPrecioFinal(item.producto)
            }))
          }
        }
      })
    })

    return res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      total
    })
  } catch (error) {
    console.error('Error creando PaymentIntent:', error)
    return res.status(500).json({
      message: error.message === 'STRIPE_SECRET_KEY no está configurada'
        ? error.message
        : 'No se pudo iniciar el pago'
    })
  }
}

export const markPaymentFailed = async (req, res) => {
  try {
    const { paymentIntentId } = req.body
    if (!paymentIntentId) {
      return res.status(400).json({ message: 'Falta el identificador del pago' })
    }

    await prisma.pagoPendiente.updateMany({
      where: {
        stripePaymentIntentId: paymentIntentId,
        idUsuario: req.usuario.idUsuario,
        estado: 'PENDING'
      },
      data: { estado: 'FAILED' }
    })

    return res.json({
      message: 'Pago registrado como fallido. Los productos quedaron guardados temporalmente.'
    })
  } catch (error) {
    console.error('Error registrando pago fallido:', error)
    return res.status(500).json({ message: 'No se pudo actualizar el estado del pago' })
  }
}

export const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body
    if (!paymentIntentId) {
      return res.status(400).json({ message: 'Falta el identificador del pago' })
    }

    const stripe = getStripe()
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (intent.status !== 'succeeded') {
      return res.status(409).json({
        message: 'El pago todavía no fue confirmado',
        stripeStatus: intent.status
      })
    }

    const pago = await prisma.pagoPendiente.findUnique({
      where: { stripePaymentIntentId: paymentIntentId },
      include: { detalles: true }
    })

    if (!pago || pago.idUsuario !== req.usuario.idUsuario) {
      return res.status(404).json({ message: 'Pago pendiente no encontrado' })
    }

    if (pago.estado === 'PAID') {
      return res.json({ message: 'El pago ya fue procesado', idPedido: pago.idPedido })
    }

    const pedido = await prisma.$transaction(async (tx) => {
      for (const detalle of pago.detalles) {
        const talla = await tx.productoTalla.findUnique({
          where: { idProductoTalla: detalle.idProductoTalla }
        })

        if (!talla || Number(talla.stock ?? 0) < detalle.cantidad) {
          throw new Error(`Stock insuficiente para ${detalle.nombreProducto}`)
        }
      }

      const nuevoPedido = await tx.pedido.create({
        data: {
          idUsuario: pago.idUsuario,
          total: pago.total
        }
      })

      await tx.detallePedido.createMany({
        data: pago.detalles.map((detalle) => ({
          idPedido: nuevoPedido.idPedido,
          idProducto: detalle.idProducto,
          idProductoTalla: detalle.idProductoTalla,
          cantidad: detalle.cantidad,
          precioUnitario: detalle.precioUnitario
        }))
      })

      for (const detalle of pago.detalles) {
        await tx.productoTalla.update({
          where: { idProductoTalla: detalle.idProductoTalla },
          data: {
            stock: { decrement: detalle.cantidad }
          }
        })
      }

      await tx.carrito.deleteMany({ where: { idUsuario: pago.idUsuario } })
      await tx.pagoPendiente.update({
        where: { idPagoPendiente: pago.idPagoPendiente },
        data: {
          estado: 'PAID',
          paidAt: new Date(),
          idPedido: nuevoPedido.idPedido
        }
      })

      return nuevoPedido
    })

    return res.json({
      message: 'Pago completado',
      idPedido: pedido.idPedido
    })
  } catch (error) {
    console.error('Error confirmando pago:', error)
    if (error.message?.startsWith('Stock insuficiente')) {
      return res.status(409).json({ message: error.message })
    }
    return res.status(500).json({ message: 'No se pudo confirmar el pago' })
  }
}