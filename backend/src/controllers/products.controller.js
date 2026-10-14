import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.producto.findMany({
      include: {
        categoria: true,
        tallas: { include: { talla: true } }
      }
    });
    res.json(products);
  } catch (error) {
    console.error("Error obteniendo productos:", error);
    res.status(500).json({ error: 'Error interno del servidor al cargar productos' });
  }
};

// Ajuste de secuencia (en caso de P2002 por id_producto)
async function fixProductoSequence() {
  const sql = `
    SELECT setval(
      pg_get_serial_sequence('productos', 'id_producto'),
      (SELECT COALESCE(MAX(id_producto), 0) FROM productos)
    )
  `;
  return prisma.$executeRawUnsafe(sql);
}

export const createProduct = async (req, res) => {
  try {
    const { nombre, precio, categoriaId, tallaId, stock } = req.body;

    let imagenPath = null;
    if (req.file) imagenPath = `/uploads/${req.file.filename}`;
    else if (req.body.imagen) imagenPath = req.body.imagen;

    const product = await prisma.producto.create({
      data: {
        nombre: nombre || null,
        precio: precio ? Number(precio) : null,
        categoriaId: categoriaId ? Number(categoriaId) : null,
        imagen: imagenPath || null
      }
    });

    if (tallaId) {
      try {
        await prisma.productoTalla.create({
          data: {
            idProducto: product.idProducto,
            idTalla: Number(tallaId),
            stock: stock ? Number(stock) : 0
          }
        });
      } catch (ptError) {
        // Si ya existe, actualizamos el stock (safe fallback)
        await prisma.productoTalla.updateMany({
          where: { idProducto: product.idProducto, idTalla: Number(tallaId) },
          data: { stock: stock ? Number(stock) : 0 }
        });
      }
    }

    const created = await prisma.producto.findUnique({
      where: { idProducto: product.idProducto },
      include: { categoria: true, tallas: { include: { talla: true } } }
    });

    res.status(201).json(created);
  } catch (error) {
    console.error('Error creando producto:', error);

    if (error?.code === 'P2002' && error?.meta?.target?.includes('id_producto')) {
      try {
        console.warn('P2002 detectado en id_producto — intentando corregir secuencia y reintentar');
        await fixProductoSequence();

        // Reintento (simple)
        const { nombre, precio, categoriaId, tallaId, stock } = req.body;
        let imagenPath = null;
        if (req.file) imagenPath = `/uploads/${req.file.filename}`;
        else if (req.body.imagen) imagenPath = req.body.imagen;

        const product = await prisma.producto.create({
          data: {
            nombre: nombre || null,
            precio: precio ? Number(precio) : null,
            categoriaId: categoriaId ? Number(categoriaId) : null,
            imagen: imagenPath || null
          }
        });

        if (tallaId) {
          await prisma.productoTalla.create({
            data: { idProducto: product.idProducto, idTalla: Number(tallaId), stock: stock ? Number(stock) : 0 }
          });
        }

        const created = await prisma.producto.findUnique({
          where: { idProducto: product.idProducto },
          include: { categoria: true, tallas: { include: { talla: true } } }
        });
        return res.status(201).json(created);
      } catch (retryError) {
        console.error('Reintento fallido al crear producto:', retryError);
        return res.status(500).json({ error: 'Error al crear producto (reintento fallido)', detail: String(retryError) });
      }
    }

    res.status(500).json({ error: 'Error interno del servidor al crear producto', detail: error.message || String(error) });
  }
};