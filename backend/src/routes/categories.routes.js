import { Router } from 'express'
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categories.controller.js'
import {
  verificarToken,
  esAdmin
} from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/', getAllCategories)
router.post('/', verificarToken, esAdmin, createCategory)
router.put('/:id', verificarToken, esAdmin, updateCategory)
router.delete('/:id', verificarToken, esAdmin, deleteCategory)

export default router