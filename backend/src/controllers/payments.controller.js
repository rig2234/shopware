import { PrismaClient } from '@prisma/client'
import Stripe from 'stripe'
import fs from 'fs'
import path from 'path'
import PDFDocument from 'pdfkit'

const prisma = new PrismaClient()

const facturasDir = path.resolve(process.cwd(), 'uploads', 'facturas')

const formatearDinero = (valor) =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(Number(valor || 0))

const generarPdfFactura = async ({ factura, pedido, usuario, detalles }) => {
  fs.mkdirSync(facturasDir, { recursive: true })

  const nombreArchivo = `factura-${factura.idFactura}.pdf`
  const rutaFisica = path.join(facturasDir, nombreArchivo)
  const rutaPublica = `/uploads/facturas/${nombreArchivo}`

  await new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 })
    const stream = fs.createWriteStream(rutaFisica)

    stream.on('finish', resolve)
    stream.on('error', reject)
    doc.on('error', reject)
    doc.pipe(stream)

    doc.rect(0, 0, doc.page.width, 140).fill('#292521')
    doc.fillColor('#ffffff')
      .font('Helvetica-Bold')
      .fontSize(28)
      .text('SHOPWARE', 50, 45)
    doc.fontSize(10)
      .font('Helvetica')
      .text('FACTURA DE COMPRA', 50, 82)
      .text(`N. ${String(factura.idFactura).padStart(6, '0')}`, 50, 98)
    doc.roundedRect(doc.page.width - 210, 45, 160, 50, 6).fill('#a8733e')
    doc.fillColor('#ffffff')
      .font('Helvetica-Bold')
      .fontSize(11)
      .text('PAGO EXITOSO', doc.page.width - 190, 58, { align: 'center', width: 120 })
      .font('Helvetica')
      .fontSize(9)
      .text(new Date(factura.fechaCreacion).toLocaleDateString('es-MX'), doc.page.width - 190, 78, { align: 'center', width: 120 })

    doc.fillColor('#292521')
      .font('Helvetica-Bold')
      .fontSize(11)
      .text('DATOS DEL CLIENTE', 50, 170)
    doc.font('Helvetica')
      .fontSize(10)
      .text(usuario?.nombre || 'Cliente Shopware', 50, 188)
      .text(usuario?.correo || 'Sin correo registrado', 50, 203)
      .text(`Pedido: ${pedido.idPedido}`, 50, 218)

    const tablaTop = 260
    doc.roundedRect(50, tablaTop, doc.page.width - 100, 28, 4).fill('#f7f1e9')
    doc.fillColor('#292521')
      .font('Helvetica-Bold')
      .fontSize(9)
      .text('PRODUCTO', 62, tablaTop + 9)
      .text('TALLA', 330, tablaTop + 9)
      .text('CANT.', 410, tablaTop + 9)
      .text('IMPORTE', 470, tablaTop + 9)

    let y = tablaTop + 38
    for (const detalle of detalles) {
      const importe = Number(detalle.precioUnitario) * detalle.cantidad
      doc.font('Helvetica')
        .fontSize(9)
        .fillColor('#292521')
        .text(detalle.producto?.nombre || 'Producto', 62, y, { width: 250 })
        .text(detalle.productoTalla?.talla?.nombre || 'Sin talla', 330, y, { width: 65 })
        .text(String(detalle.cantidad), 410, y, { width: 45 })
        .text(formatearDinero(importe), 470, y, { width: 80, align: 'right' })
      y += 30
      doc.moveTo(50, y - 8).lineTo(doc.page.width - 50, y - 8).strokeColor('#eeeeee').stroke()
    }

    y += 20
    doc.roundedRect(330, y, doc.page.width - 380, 70, 6).fill('#292521')
    doc.fillColor('#ffffff')
      .font('Helvetica-Bold')
      .fontSize(10)
      .text('TOTAL PAGADO', 345, y + 16)
      .fontSize(17)
      .text(formatearDinero(pedido.total), 345, y + 40)

    doc.fillColor('#777777')
      .font('Helvetica')
      .fontSize(8)
      .text('Gracias por tu compra.', 50, doc.page.height - 70)
      .text('Documento generado automáticamente por Shopware.', 50, doc.page.height - 56)

    doc.end()
  })

  return rutaPublica
}

const asegurarFactura = async (pedido) => {
  const facturaExistente = await prisma.factura.findFirst({
    where: { idPedido: pedido.idPedido }
  })
  if (facturaExistente?.rutaPdf) {
    const rutaFisica = path.join(facturasDir, path.basename(facturaExistente.rutaPdf))
    if (fs.existsSync(rutaFisica)) return facturaExistente
  }

  const pedidoCompleto = await prisma.pedido.findUnique({
    where: { idPedido: pedido.idPedido },
    include: {
      usuario: true,
      detalles: {
        include: {
          producto: true,
          productoTalla: { include: { talla: true } }
        }
      }

    }
  })

  if (!pedidoCompleto) {
    throw new Error('Pedido no encontrado para generar la factura')
  }

  const factura = facturaExistente || await prisma.factura.create({
    data: {
      idUsuario: pedidoCompleto.idUsuario,
      idPedido: pedidoCompleto.idPedido
    }
  })

  const rutaPdf = await generarPdfFactura({
    factura,
    pedido: pedidoCompleto,
    usuario: pedidoCompleto.usuario,
    detalles: pedidoCompleto.detalles
  })

  return prisma.factura.update({
    where: { idFactura: factura.idFactura },
    data: { rutaPdf }
  })
}

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
    const compraDirecta = ['idProducto', 'idProductoTalla', 'cantidad']
      .some((campo) => req.body?.[campo] !== undefined)
    let items

    if (compraDirecta) {
      const idProducto = Number(req.body.idProducto)
      const idProductoTalla = Number(req.body.idProductoTalla)
      const cantidad = Number(req.body.cantidad)

      if (
        !Number.isInteger(idProducto) || idProducto <= 0 ||
        !Number.isInteger(idProductoTalla) || idProductoTalla <= 0 ||
        !Number.isInteger(cantidad) || cantidad <= 0
      ) {
        return res.status(400).json({ message: 'Los datos de la compra no son válidos' })
      }

      const productoTalla = await prisma.productoTalla.findUnique({
        where: { idProductoTalla },
        include: { producto: true, talla: true }
      })

      if (!productoTalla || productoTalla.idProducto !== idProducto) {
        return res.status(400).json({ message: 'El producto o la talla no son válidos' })
      }

      items = [{
        idProducto,
        idProductoTalla,
        cantidad,
        producto: productoTalla.producto,
        productoTalla
      }]
    } else {
      items = await prisma.carrito.findMany({
        where: { idUsuario },
        include: {
          producto: true,
          productoTalla: { include: { talla: true } }
        }
      })
    }

    if (!items.length) {
      return res.status(400).json({
        message: compraDirecta ? 'No se encontró el producto solicitado' : 'El carrito está vacío'
      })
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
        tipo: compraDirecta ? 'compra_directa' : 'shopware_pago_escolar'
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
      const pedidoExistente = await prisma.pedido.findUnique({
        where: { idPedido: pago.idPedido }
      })
      if (!pedidoExistente) {
        return res.status(404).json({ message: 'Pedido no encontrado' })
      }
      const factura = await asegurarFactura(pedidoExistente)
      return res.json({
        message: 'El pago ya fue procesado',
        idPedido: pago.idPedido,
        factura: {
          idFactura: factura.idFactura,
          rutaPdf: factura.rutaPdf
        }
      })
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
          total: pago.total,
          estado: 'PREPARACION'
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

      if (intent.metadata?.tipo !== 'compra_directa') {
        await tx.carrito.deleteMany({ where: { idUsuario: pago.idUsuario } })
      }
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

    const factura = await asegurarFactura(pedido)

    return res.json({
      message: 'Pago completado',
      idPedido: pedido.idPedido,
      factura: {
        idFactura: factura.idFactura,
        rutaPdf: factura.rutaPdf
      }
    })
  } catch (error) {
    console.error('Error confirmando pago:', error)
    if (error.message?.startsWith('Stock insuficiente')) {
      return res.status(409).json({ message: error.message })
    }
    return res.status(500).json({ message: 'No se pudo confirmar el pago' })
  }
}

export const downloadInvoice = async (req, res) => {
  try {
    const idPedido = Number(req.params.idPedido)
    if (!Number.isInteger(idPedido) || idPedido <= 0) {
      return res.status(400).json({ message: 'Pedido no válido' })
    }

    const where = { idPedido }
    if (req.usuario.idRol !== 2) {
      where.idUsuario = req.usuario.idUsuario
    }

    const pedido = await prisma.pedido.findFirst({
      where,
      include: { facturas: true }
    })

    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' })
    }

    let factura = pedido.facturas[0]
    if (!factura) {
      factura = await asegurarFactura(pedido)
    } else if (!factura.rutaPdf) {
      factura = await asegurarFactura(pedido)
    }

    const nombreArchivo = path.basename(factura.rutaPdf)
    const rutaFisica = path.join(facturasDir, nombreArchivo)

    if (!fs.existsSync(rutaFisica)) {
      factura = await asegurarFactura(pedido)
    }

    const rutaFinal = path.join(facturasDir, path.basename(factura.rutaPdf))
    if (!fs.existsSync(rutaFinal)) {
      return res.status(404).json({ message: 'La factura no está disponible' })
    }

    res.setHeader('Content-Type', 'application/pdf')
    const disposicion = req.query.download === 'true' ? 'attachment' : 'inline'
    const nombreDescarga = `factura-${String(factura.idFactura).padStart(6, '0')}.pdf`
    res.setHeader(
      'Content-Disposition',
      `${disposicion}; filename=${nombreDescarga}`
    )
    return res.sendFile(rutaFinal)
  } catch (error) {
    console.error('Error descargando factura:', error)
    return res.status(500).json({ message: 'No se pudo obtener la factura' })
  }
}

export const getOrderTracking = async (req, res) => {
  try {
    const idPedido = Number(req.params.idPedido)
    if (!Number.isInteger(idPedido) || idPedido <= 0) {
      return res.status(400).json({ message: 'Pedido no válido' })
    }

    const pedido = await prisma.pedido.findFirst({
      where: {
        idPedido,
        idUsuario: req.usuario.idUsuario
      },
      select: {
        idPedido: true,
        fechaPedido: true,
        estado: true
      }
    })

    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' })
    }

    return res.json(pedido)
  } catch (error) {
    console.error('Error obteniendo seguimiento del pedido:', error)
    return res.status(500).json({ message: 'No se pudo obtener el seguimiento del pedido' })
  }
}

export const getUserOrders = async (req, res) => {
  try {
    const pedidos = await prisma.pedido.findMany({
      where: { idUsuario: req.usuario.idUsuario },
      select: {
        idPedido: true,
        fechaPedido: true,
        total: true,
        estado: true,
        detalles: {
          select: {
            cantidad: true,
            producto: {
              select: { nombre: true }
            },
            productoTalla: {
              select: {
                talla: {
                  select: { nombre: true }
                }
              }
            }
          }
        }
      },
      orderBy: { fechaPedido: 'desc' }
    })

    return res.json(pedidos)
  } catch (error) {
    console.error('Error obteniendo pedidos del usuario:', error)
    return res.status(500).json({ message: 'No se pudieron cargar tus pedidos' })
  }
}

export const cancelOrder = async (req, res) => {
  let idPedido
  let estadoAnterior
  let retomandoCancelacion = false
  let reembolsoProcesado = false

  try {
    idPedido = Number(req.params.idPedido)
    if (!Number.isInteger(idPedido) || idPedido <= 0) {
      return res.status(400).json({ message: 'Pedido no válido' })
    }

    const pedido = await prisma.pedido.findFirst({
      where: {
        idPedido,
        idUsuario: req.usuario.idUsuario
      },
      select: { estado: true }
    })

    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' })
    }
    if (pedido.estado === 'CANCELADO') {
      return res.status(409).json({ message: 'El pedido ya fue cancelado' })
    }
    if (pedido.estado === 'ENTREGADO') {
      return res.status(409).json({ message: 'No se puede cancelar un pedido que ya fue entregado' })
    }

    if (pedido.estado !== 'CANCELACION_PENDIENTE') {
      if (!['PREPARACION', 'EN_CAMINO'].includes(pedido.estado)) {
        return res.status(409).json({ message: 'El pedido no se puede cancelar en su estado actual' })
      }

      estadoAnterior = pedido.estado
      const reservaCancelacion = await prisma.pedido.updateMany({
        where: {
          idPedido,
          idUsuario: req.usuario.idUsuario,
          estado: pedido.estado
        },
        data: { estado: 'CANCELACION_PENDIENTE' }
      })

      if (!reservaCancelacion.count) {
        return res.status(409).json({ message: 'El estado del pedido cambió; actualiza la página e inténtalo de nuevo' })
      }
    } else {
      retomandoCancelacion = true
    }

    const pago = await prisma.pagoPendiente.findFirst({
      where: {
        idPedido,
        idUsuario: req.usuario.idUsuario,
        estado: 'PAID'
      }
    })

    if (!pago) {
      if (!retomandoCancelacion) {
        await prisma.pedido.updateMany({
          where: { idPedido, estado: 'CANCELACION_PENDIENTE' },
          data: { estado: estadoAnterior }
        })
      }
      return res.status(409).json({ message: 'No se encontró el pago confirmado para reembolsar este pedido' })
    }

    const stripe = getStripe()
    await stripe.refunds.create(
      { payment_intent: pago.stripePaymentIntentId },
      { idempotencyKey: `cancelar-pedido-${idPedido}` }
    )
    reembolsoProcesado = true

    await prisma.$transaction(async (tx) => {
      const cancelacion = await tx.pedido.updateMany({
        where: {
          idPedido,
          idUsuario: req.usuario.idUsuario,
          estado: 'CANCELACION_PENDIENTE'
        },
        data: { estado: 'CANCELADO' }
      })

      if (!cancelacion.count) {
        const pedidoActual = await tx.pedido.findUnique({
          where: { idPedido },
          select: { estado: true }
        })
        if (pedidoActual?.estado === 'CANCELADO') return
        throw new Error('El pedido cambió antes de completar la cancelación')
      }

      const detalles = await tx.detallePedido.findMany({
        where: { idPedido },
        select: { idProductoTalla: true, cantidad: true }
      })

      for (const detalle of detalles) {
        await tx.productoTalla.update({
          where: { idProductoTalla: detalle.idProductoTalla },
          data: { stock: { increment: detalle.cantidad || 0 } }
        })
      }

      await tx.pagoPendiente.update({
        where: { idPagoPendiente: pago.idPagoPendiente },
        data: { estado: 'REFUNDED' }
      })
    })

    return res.json({ message: 'Pedido cancelado; el reembolso fue solicitado y el inventario fue restaurado' })
  } catch (error) {
    console.error('Error cancelando pedido:', error)
    if (idPedido && estadoAnterior && !retomandoCancelacion && !reembolsoProcesado) {
      await prisma.pedido.updateMany({
        where: { idPedido, estado: 'CANCELACION_PENDIENTE' },
        data: { estado: estadoAnterior }
      }).catch((rollbackError) => {
        console.error('Error restaurando el estado del pedido:', rollbackError)
      })
    }

    return res.status(500).json({
      message: reembolsoProcesado
        ? 'El reembolso se procesó, pero la cancelación quedó pendiente. Intenta nuevamente para completar la actualización del inventario.'
        : 'No se pudo cancelar el pedido ni procesar el reembolso'
    })
  }
}