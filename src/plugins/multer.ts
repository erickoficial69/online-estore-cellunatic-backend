import multer from 'multer'
import {extname} from 'path'

const storage = multer.diskStorage({
    destination:'public/upload',
    filename(rq,file,cb){
        const archivo = `${Date.now()+extname(file.originalname)}`
        cb(null, archivo)
    }
})
 const uploadImage=multer({storage})

export default uploadImage