import { Router } from 'express'
import { getAllOrders } from '../controllers/orders.controller.js'
import { verificarToken, esAdmin } from '../middlewares/auth.middleware.js'

const router = Router()

router.use(verificarToken, esAdmin)
router.get('/', getAllOrders)

export default router
