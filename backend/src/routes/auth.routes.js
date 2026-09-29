import { Router } from 'express';
import { registrarUsuario } from '../controllers/auth.controller.js';

const router = Router();

// Endpoint para registro: POST /api/auth/registro
router.post('/registro', registrarUsuario);

export default router;