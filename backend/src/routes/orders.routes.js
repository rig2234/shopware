import { Router } from 'express'
import { getAllOrders, updateOrderStatus } from '../controllers/orders.controller.js'
import { verificarToken, esAdmin } from '../middlewares/auth.middleware.js'

const router = Router()

router.use(verificarToken, esAdmin)
router.get('/', getAllOrders)
router.patch('/:idPedido/status', updateOrderStatus)

export default router
