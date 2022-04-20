import { Router } from 'express'
import { check } from 'express-validator'

import {
    createLink,
    hasPassword,
    getLink,
    verifyPassword,
} from '../controllers/linksController.js'
import auth from '../middlewares/auth.js'

const router = Router()

router.post(
    '/',
    [
        check('name', 'Sube un archivo').not().isEmpty(),
        check('originalName', 'Sube un archivo').not().isEmpty(),
    ],
    auth,
    createLink
)
router.get('/:url', hasPassword, getLink)
router.post('/:url', verifyPassword, getLink)

export default router
