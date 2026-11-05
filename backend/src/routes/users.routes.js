import { Router } from 'express'
import {
  getAllUsers,
  getAllRoles,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/users.controller.js'
import {
  verificarToken,
  esAdmin
} from '../middlewares/auth.middleware.js'

const router = Router()

router.use(verificarToken, esAdmin)

router.get('/roles', getAllRoles)
router.get('/', getAllUsers)
router.post('/', createUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

export default router