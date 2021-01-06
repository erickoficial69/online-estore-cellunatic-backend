import express,{Application,json, urlencoded,text} from 'express'
import cors from 'cors'
import helmet from 'helmet'
import {resolve} from 'path'
import appData from './routes/appData.routes'

//Routes
import indexRoutes from './routes/index.routes'
import accesoriesRoutes from './routes/accesories.routes'
import productsRoutes from './routes/products.routes'
import repuestosRoutes from './routes/repuestos.routes'
import users from './routes/users.routes'

export class App{
    private app:Application
    private port:any
    constructor(port:any){
        this.app= express()
        this.port = port

        this.middlewares()
        this.routes()
    }
    middlewares(){
        this.app.use(helmet())
        this.app.use(cors())
        this.app.use(urlencoded({extended:true,limit:'2048mb'}))
        this.app.use(json({limit:'2048mb'}))
        this.app.use(text({limit:'2048mb'}))
        this.app.use(express.static(resolve('public')))
    }
    routes(){
        this.app.use(indexRoutes)
        this.app.use(accesoriesRoutes)
        this.app.use(productsRoutes)
        this.app.use(repuestosRoutes)
        this.app.use(users)
        this.app.use(appData)
    }
    async listen(){
        try{
            await this.app.listen(this.port)
            console.log('server on port: ',this.port)
        }
        catch(err){
            return console.log(err)
        }
    }
}

type Opts={
    base64:string
    ext:string
}

export function purifyBase64String(param:string):Opts{
    if(param.substring(5,15) === "image/jpeg"){
        return {
            base64:param.replace("data:image/jpeg;base64,",""),
            ext:'jpg'
        }
    }

    if(param.substring(5,14) === "image/png"){
        return {
            base64:param.replace("data:image/png;base64,",""),
            ext:'png'
        }
    }

    if(param.substring(5,14) === "image/gif"){
        return {
            base64:param.replace("data:image/gif;base64,",""),
            ext:'gif'
        }
    }

    if(param.substring(5,18) === "image/svg+xml"){
        return {
            base64:param.replace("data:image/svg+xml;base64,",""),
            ext:'svg'
        }
    }

    return {
        base64:param.replace("data:image/webp;base64,",""),
        ext:'webp'
    }
    
}

export function verifyBase64String(param:string):boolean{
    const data = param.substring(0,11)
    if(data === "data:image/"){
        return true
    }
    return false
}