import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

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

export const deleteProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({ error: 'ID de producto inválido' });
    }

    const product = await prisma.producto.findUnique({
      where: { idProducto: id }
    });

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // borrar imagen del disco si existe
    if (product.imagen && !product.imagen.startsWith('http')) {
      const relativePath = product.imagen.replace(/^\/+/, '');
      const filePath = path.resolve(process.cwd(), 'backend', relativePath);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await prisma.productoTalla.deleteMany({
      where: { idProducto: id }
    });

    await prisma.producto.delete({
      where: { idProducto: id }
    });

    return res.json({ message: 'Producto eliminado correctamente', id });
  } catch (error) {
    console.error('Error eliminando producto:', error);
    return res.status(500).json({ error: 'Error al eliminar producto', detail: error.message || String(error) });
  }
};