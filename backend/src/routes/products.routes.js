import { Router } from 'express';
import { getAllProducts } from '../controllers/products.controller.js';

const router = Router();

// Si quieres proteger la ruta, aquí puedes agregar tu middleware verifyToken
router.get('/', getAllProducts)

export default router;