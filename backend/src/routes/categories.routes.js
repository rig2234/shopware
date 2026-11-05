import { Router } from 'express'
import {
  getAllCategories,
  createCategory
} from '../controllers/categories.controller.js'
import {
  verificarToken,
  esAdmin
} from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/', getAllCategories)
router.post('/', verificarToken, esAdmin, createCategory)

export default router