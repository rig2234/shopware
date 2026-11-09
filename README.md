# proyecto shopware tienda de ropa

ALTER TABLE productos
ADD COLUMN descuento DECIMAL(5, 2) NOT NULL DEFAULT 0;

npm install @prisma/client@5.22.0
npm install --save-dev prisma@5.22.0

npx prisma generate --schema=prisma/schema.prisma