import { Router } from 'express';
import { 
  solicitarVerificacion, 
  confirmarVerificacion, 
  iniciarSesion 
} from '../controllers/auth.controller.js';

const router = Router();

router.post('/registro/solicitar', solicitarVerificacion);
router.post('/registro/confirmar', confirmarVerificacion);
router.post('/login', iniciarSesion);

export default router;