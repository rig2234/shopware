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
