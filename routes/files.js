import { Router } from 'express'

import {
    uploadFile,
    downloadFile,
    deleteFile,
} from '../controllers/filesController.js'
import auth from '../middlewares/auth.js'

const router = Router()

router.post('/', auth, uploadFile)
router.get('/:file', downloadFile, deleteFile)

export default router
