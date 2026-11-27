# proyecto shopware tienda de ropa

ALTER TABLE productos
ADD COLUMN descuento DECIMAL(5, 2) NOT NULL DEFAULT 0;

npm install @prisma/client@5.22.0
npm install --save-dev prisma@5.22.0

Desde `backend`, aplica las migraciones pendientes y genera el cliente Prisma antes de iniciar la aplicación:

npx prisma migrate deploy
npx prisma generate --schema=prisma/schema.prisma