import { Router } from 'express'
import { check } from 'express-validator'

import { createUser } from '../controllers/usersController.js'

const router = Router()

router.post(
    '/',
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'Agrega un email válido').isEmail(),
        check(
            'password',
            'La contraseña debe tener al menos 6 caracteres'
        ).isLength({ min: 6 }),
    ],
    createUser
)

export default router
