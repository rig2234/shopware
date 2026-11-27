import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.pedido.findMany({
      include: {
        usuario: {
          select: {
            idUsuario: true,
            nombre: true,
            correo: true
          }
        },
        detalles: {
          include: {
            producto: {
              select: {
                nombre: true
              }
            },
            productoTalla: {
              include: {
                talla: {
                  select: {
                    nombre: true
                  }
                }
              }
            }
          }
        },
        facturas: {
          select: {
            idFactura: true,
            fechaCreacion: true
          }
        }
      },
      orderBy: { fechaPedido: 'desc' }
    })

    return res.json(orders)
  } catch (error) {
    console.error('Error obteniendo pedidos:', error)
    return res.status(500).json({ error: 'Error al cargar pedidos' })
  }
}

export const updateOrderStatus = async (req, res) => {
  try {
    const idPedido = Number(req.params.idPedido)
    const { estado } = req.body
    const estadosValidos = ['PREPARACION', 'EN_CAMINO', 'ENTREGADO']

    if (!Number.isInteger(idPedido) || idPedido <= 0 || !estadosValidos.includes(estado)) {
      return res.status(400).json({ message: 'El pedido o el estado no son válidos' })
    }

    const pedido = await prisma.pedido.findUnique({
      where: { idPedido },
      select: { estado: true }
    })

    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' })
    }

    if (pedido.estado === estado) {
      return res.json({ message: 'El estado del pedido no cambió', estado })
    }

    const transicionesPermitidas = {
      PREPARACION: ['EN_CAMINO'],
      EN_CAMINO: ['ENTREGADO']
    }

    if (!transicionesPermitidas[pedido.estado]?.includes(estado)) {
      return res.status(409).json({ message: 'No se puede cambiar el pedido desde su estado actual' })
    }

    const actualizacion = await prisma.pedido.updateMany({
      where: { idPedido, estado: pedido.estado },
      data: { estado }
    })

    if (!actualizacion.count) {
      return res.status(409).json({ message: 'El pedido cambió mientras se actualizaba' })
    }

    return res.json({ message: 'Estado del pedido actualizado', estado })
  } catch (error) {
    console.error('Error actualizando estado del pedido:', error)
    return res.status(500).json({ message: 'No se pudo actualizar el estado del pedido' })
  }
}
