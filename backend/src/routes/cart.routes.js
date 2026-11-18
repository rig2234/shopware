import { Router } from 'express'
import {
  addToCart,
  getCart,
  removeFromCart
} from '../controllers/cart.controller.js'
import { verificarToken } from '../middlewares/auth.middleware.js'

const router = Router()

router.use(verificarToken)

router.get('/', getCart)
router.post('/', addToCart)
router.delete('/:id', removeFromCart)

export default router