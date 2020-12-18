import {Router} from 'express'
import * as appData from '../controllers/appData.controllers'
const router = Router()

router.put('/app',appData.updateData)
router.get('/app',appData.getData)
router.post('/app',appData.createData)
router.get('/app/tasacambio',appData.getTasaCambio)
router.put('/app/tasacambio',appData.updateTasaCambio)

export default router