import { Router } from 'express';
import { getAllUsers } from '../controllers/users.controller.js';
import { verificarToken, esAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', verificarToken, esAdmin, getAllUsers);

export default router;