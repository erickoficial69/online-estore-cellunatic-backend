import {Router} from 'express'
import * as repuestos from '../controllers/repuestos.controller'
const router = Router()

router.get('/repuestos/:limit?',repuestos.getAll)
router.post('/repuestos/filter',repuestos.getByProduct)

router.delete('/repuestos/:id?',repuestos.deleteRepuesto)
router.get('/repuestos/detail/:id?',repuestos.getById)
router.put('/repuestos', repuestos.updateRepuesto)
router.post('/repuestos', repuestos.newRepuesto)


export default router