import { Router } from 'express'
import { check } from 'express-validator'

import { authenticateUser, getUser } from '../controllers/authController.js'
import auth from '../middlewares/auth.js'

const router = Router()

router.post(
    '/',
    [
        check('email', 'Agrega un email válido').isEmail(),
        check('password', 'La contraseña no puede estar vacía').not().isEmpty(),
    ],
    authenticateUser
)
router.get('/', auth, getUser)

export default router
