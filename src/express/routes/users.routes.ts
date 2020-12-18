import {Router} from 'express'
import * as users from '../controllers/users.controllers'
const router = Router()

router.post('/users',users.createUser)
router.post('/user',users.getUser)

export default router