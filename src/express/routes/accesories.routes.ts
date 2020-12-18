import {Router} from 'express'
import * as accesorios from '../controllers/accesories.controller'
const router = Router()

router.get('/accesorios/:limit?',accesorios.getAll)
router.post('/accesorios/filter',accesorios.getByProduct)

router.delete('/accesorios/:id?',accesorios.deleteAccesorio)
router.get('/accesorios/detail/:id?',accesorios.getById)
router.put('/accesorios', accesorios.updateAccesorio)
router.post('/accesorios', accesorios.newAccesorio)


export default router