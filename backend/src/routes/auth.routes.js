import { Router } from 'express';
import { 
  solicitarVerificacion, 
  confirmarVerificacion, 
  iniciarSesion,
  obtenerPerfilUsuario,
  actualizarDireccionUsuario
} from '../controllers/auth.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/registro/solicitar', solicitarVerificacion);
router.post('/registro/confirmar', confirmarVerificacion);
router.post('/login', iniciarSesion);
router.get('/profile', verificarToken, obtenerPerfilUsuario);
router.put('/profile/address', verificarToken, actualizarDireccionUsuario);

export default router;