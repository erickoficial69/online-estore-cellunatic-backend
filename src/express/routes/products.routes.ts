import {Router} from 'express'
import * as productos from '../controllers/products.controller'
const router = Router()

router.get('/productos',productos.getAll)
router.get('/productos/:id',productos.getById)
router.get('/productos/seccion/:seccion',productos.getBySeccion)
router.put('/productos',productos.updateProduct)
router.post('/productos',productos.create)
router.delete('/productos/:id',productos.remove)

export default router