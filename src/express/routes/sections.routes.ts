import {Router} from 'express'
import * as sections from '../controllers/sections.controller'
const router = Router()

router.get('/sections',sections.getAll)
router.get('/sections/:url',sections.getByUrl)
router.put('/sections',sections.updateSection)
router.post('/sections',sections.create)
router.delete('/sections/:id',sections.remove)

export default router