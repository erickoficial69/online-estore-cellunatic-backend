import {Router} from 'express'
import * as dispositivos from '../controllers/devices.controller'
const router = Router()

router.get('/dispositivos',dispositivos.getAll)
router.get('/dispositivos/:id',dispositivos.getById)
router.put('/dispositivos',dispositivos.updateProduct)
router.post('/dispositivos',dispositivos.create)
router.delete('/dispositivos/:id',dispositivos.remove)

export default router