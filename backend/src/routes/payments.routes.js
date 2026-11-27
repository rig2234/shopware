import { Router } from 'express'
import {
  createPaymentIntent,
  confirmPayment,
  markPaymentFailed,
  downloadInvoice,
  getOrderTracking,
  getUserOrders,
  cancelOrder
} from '../controllers/payments.controller.js'
import { verificarToken } from '../middlewares/auth.middleware.js'

const router = Router()

router.use(verificarToken)
router.post('/create-intent', createPaymentIntent)
router.post('/confirm', confirmPayment)
router.post('/failed', markPaymentFailed)
router.get('/invoice/:idPedido', downloadInvoice)
router.get('/orders', getUserOrders)
router.post('/orders/:idPedido/cancel', cancelOrder)
router.get('/orders/:idPedido/tracking', getOrderTracking)

export default router
