diseño desacoplado (frontend y backend)

## General
- Usa ES Modules (`import`/`export`) en todo el proyecto.
- Código limpio, modular y con manejo explícito de errores (`try/catch` con respuestas HTTP estándar).

frontend: vue 3.4 SPA, tailwind 4 css, pinia, vue router

backend: node.js express, prisma orm 5.22

### Sigue la skill modern-web-guidance

se debe permitir al usuario navegar en la tienda sin estar logueado, pero al momento de querer comprar o agregar
al carrito debe pedirle loguearse, una vez logueado debe volver a la parte donde se quedo y continuar
igual el pago y facturar debe estar restringuido asi como ingresar la direccion del usuario

### En las consultas de prisma 5.22 optimizalas y no obtengas informacion innecesaria
