import { Router } from 'express';
import { getAllTallas } from '../controllers/tallas.controller.js';
const router = Router();
router.get('/', getAllTallas);
export default router;