import {RequestHandler} from 'express'
import {decode} from 'node-base64-image'
import {unlink} from 'fs'
import {resolve} from 'path'
import AccesoriosMobiles from '../../mongodb/models/accesorios.mobiles'
import { purifyBase64String, verifyBase64String } from '../app'
import {express} from '../../config'
const {domains} = express

export const getAll:RequestHandler = async(req,res)=>{
    let limit:number = req.params.limit?parseInt(req.params.limit):10
    try{
        const accesories = await AccesoriosMobiles.find().limit(limit).sort({updatedAt:-1})
        res.json({accesories,count:accesories.length})
        
    }catch(err){
        res.send()
    }
}

export const getById:RequestHandler = async(req,res)=>{
    if(req.params.id){
        try{
            const accesorie = await AccesoriosMobiles.findById(req.params.id).limit(1)
            if(accesorie){
                const {producto,visitas} = await accesorie.toJSON()
                
                const relacionados = await AccesoriosMobiles.find({producto}).limit(6).sort({visitas:-1})
                await AccesoriosMobiles.findByIdAndUpdate(req.params.id,{
                    visitas:visitas+1
                },{new:true})
                
                return res.json({accesorie,relacionados})
            }
            res.json()
        }catch(err){
            console.log(err)
            res.json()
        } 
    }
    
}

export const getByProduct:RequestHandler = async(req,res)=>{
    const {search,limit} = req.body

    if(search !==''){
        try{

            const accesories = await AccesoriosMobiles.find(
                {$or:[
                    {nombre:{$regex:search.replace(' ','|')}},
                    {color:{$regex:search.replace(' ','|')}},
                    {producto:{$regex:search.replace(' ','|')}},
                    {modelo:{$regex:search.replace(' ','|')}}
            ]}
            ).limit(limit?parseInt(limit):10).sort({createdAt:-1})
           if(accesories){
               
               return res.json({accesories,count:accesories.length})
           }
           res.json()
        }catch(err){
            console.log(err)
            res.json([])
        }
    }
    const accesories = await AccesoriosMobiles.find().limit(limit?parseInt(limit):10).sort({createdAt:-1})
    
    res.json({accesories,count:accesories.length})
}


export const newAccesorio:RequestHandler  = async(req,res)=>{
    const {newAccesorio} = req.body
    const {imagenes} = newAccesorio

    const name = Date.now()

    try{
        if(imagenes.imagen1!==''){
            const base64_1 = purifyBase64String(imagenes.imagen1)
            await decode(base64_1.base64,{ext:base64_1.ext,fname:`public/upload/${name}`})
            newAccesorio.imagenes.imagen1 = `upload/${name+'.'+base64_1.ext}`
        }
        
        if(imagenes.imagen2!==''){
            const base64_2 = purifyBase64String(imagenes.imagen2)
            await decode(base64_2.base64,{ext:base64_2.ext,fname:`public/upload/${name+1}`})
            newAccesorio.imagenes.imagen2 = `upload/${name+1+'.'+base64_2.ext}`
        }

        if(imagenes.imagen3!==''){
            const base64_3 = purifyBase64String(imagenes.imagen3)
            await decode(base64_3.base64,{ext:base64_3.ext,fname:`public/upload/${name+2}`})
            newAccesorio.imagenes.imagen3 = `upload/${name+2+'.'+base64_3.ext}`
        }

        const newData = new AccesoriosMobiles(newAccesorio)    
        await newData.save()
        console.log(newData)
        res.json(newData)
    }catch(err){
        console.log(err)
        res.json()
    }
}

export const deleteAccesorio:RequestHandler = async(req,res)=>{
    try{
        const forRemove = await AccesoriosMobiles.findById(req.params.id)
        let data = forRemove?forRemove.toJSON():null
        const accesorie = await AccesoriosMobiles.findByIdAndDelete(req.params.id)
        res.json(accesorie)
        
        if(data.imagenes.imagen1!==""){
            unlink(resolve(`public/${data.imagenes.imagen1}`),()=>{})
        }
        if(data.imagenes.imagen2!==""){
            
            unlink(resolve(`public/${data.imagenes.imagen2}`),()=>{})
        }
        if(data.imagenes.imagen3 !==""){
            
            unlink(resolve(`public/${data.imagenes.imagen3}`),()=>{})
        }
    }catch(err){
        console.log(err)
        res.json()
    }
}

export const updateAccesorio:RequestHandler = async(req,res)=>{
    const {newData,id} = req.body

    const verify1 = verifyBase64String(newData.imagenes.imagen1)
    const verify2 = verifyBase64String(newData.imagenes.imagen2)
    const verify3 = verifyBase64String(newData.imagenes.imagen3)
    const name = Date.now()

    try{
        
        if(verify1 === true && verify2 === false && verify3 === false){
            const base64_1 = purifyBase64String(newData.imagenes.imagen1)
            await decode(base64_1.base64,{ext:base64_1.ext,fname:`public/upload/${name}`})
            newData.imagenes.imagen1 = `upload/${name+'.'+base64_1.ext}`

            const accesorie = await AccesoriosMobiles.findByIdAndUpdate(id,newData)

            res.json(accesorie)
            const accJson = accesorie?.toJSON()
            
            const imagen1 = accJson?.imagenes.imagen1.replace(`${domains.backend_cellunatic}/`,'')
            unlink(resolve(`public/${imagen1}`),()=>{})
            return
        }

        if(verify1 === true && verify2 ===true && verify3 === false){
            const base64_1 = purifyBase64String(newData.imagenes.imagen1)
            await decode(base64_1.base64,{ext:base64_1.ext,fname:`public/upload/${name}`})
            newData.imagenes.imagen1 = `upload/${name+'.'+base64_1.ext}`
            
            const base64_2 = purifyBase64String(newData.imagenes.imagen2)
            await decode(base64_2.base64,{ext:base64_2.ext,fname:`public/upload/${name}`})
            newData.imagenes.imagen2 = `upload/${name+'.'+base64_2.ext}`
            
            const accesorie = await AccesoriosMobiles.findByIdAndUpdate(id,newData)

            res.json(accesorie)
            const accJson = accesorie?.toJSON()
            
            const imagen1 = accJson?.imagenes.imagen1.replace(`${domains.backend_cellunatic}/`,'')
            unlink(resolve(`public/${imagen1}`),()=>{})

            const imagen2 = accJson?.imagenes.imagen2.replace(`${domains.backend_cellunatic}/`,'')
            unlink(resolve(`public/${imagen2}`),()=>{})
            return
            
        }

        if(verify1 === true && verify2 ===false && verify3 === true){
            
            const base64_1 = purifyBase64String(newData.imagenes.imagen1)
            await decode(base64_1.base64,{ext:base64_1.ext,fname:`public/upload/${name}`})
            newData.imagenes.imagen1 = `upload/${name+'.'+base64_1.ext}`
            
            const base64_3 = purifyBase64String(newData.imagenes.imagen3)
            await decode(base64_3.base64,{ext:base64_3.ext,fname:`public/upload/${name}`})
            newData.imagenes.imagen3 = `upload/${name+'.'+base64_3.ext}`

            const accesorie = await AccesoriosMobiles.findByIdAndUpdate(id,newData)

            res.json(accesorie)
            const accJson = accesorie?.toJSON()
            
            const imagen1 = accJson?.imagenes.imagen1.replace(`${domains.backend_cellunatic}/`,'')
            unlink(resolve(`public/${imagen1}`),()=>{})

            const imagen3 = accJson?.imagenes.imagen3.replace(`${domains.backend_cellunatic}/`,'')
            unlink(resolve(`public/${imagen3}`),()=>{})
            return
            
        }

        if(verify1 === false && verify2 ===true && verify3 === false){
            
            const base64_2 = purifyBase64String(newData.imagenes.imagen2)
            await decode(base64_2.base64,{ext:base64_2.ext,fname:`public/upload/${name}`})
            newData.imagenes.imagen2 = `upload/${name+'.'+base64_2.ext}`
            
            const accesorie = await AccesoriosMobiles.findByIdAndUpdate(id,newData)

            res.json(accesorie)
            const accJson = accesorie?.toJSON()
            
            const imagen2 = accJson?.imagenes.imagen2.replace(`${domains.backend_cellunatic}/`,'')
            unlink(resolve(`public/${imagen2}`),()=>{})
            return
            
        }

        if(verify1 === false && verify2 ===true && verify3 === true){
            
            const base64_2 = purifyBase64String(newData.imagenes.imagen2)
            await decode(base64_2.base64,{ext:base64_2.ext,fname:`public/upload/${name}`})
            newData.imagenes.imagen2 = `upload/${name+'.'+base64_2.ext}`
            
            const base64_3 = purifyBase64String(newData.imagenes.imagen2)
            await decode(base64_3.base64,{ext:base64_3.ext,fname:`public/upload/${name}`})
            newData.imagenes.imagen2 = `upload/${name+'.'+base64_3.ext}`

            const accesorie = await AccesoriosMobiles.findByIdAndUpdate(id,newData)

            res.json(accesorie)
            const accJson = accesorie?.toJSON()
            
            const imagen2 = accJson?.imagenes.imagen2.replace(`${domains.backend_cellunatic}/`,'')
            unlink(resolve(`public/${imagen2}`),()=>{})

            const imagen3 = accJson?.imagenes.imagen3.replace(`${domains.backend_cellunatic}/`,'')
            unlink(resolve(`public/${imagen3}`),()=>{})
            return
            
        }

        if(verify1 === false && verify2 ===false && verify3 === true){
            
            const base64_3 = purifyBase64String(newData.imagenes.imagen3)
            await decode(base64_3.base64,{ext:base64_3.ext,fname:`public/upload/${name}`})
            newData.imagenes.imagen3 = `upload/${name+'.'+base64_3.ext}`
            
            const accesorie = await AccesoriosMobiles.findByIdAndUpdate(id,newData)

            res.json(accesorie)
            const accJson = accesorie?.toJSON()
            
            const imagen3 = accJson?.imagenes.imagen3.replace(`${domains.backend_cellunatic}/`,'')
            unlink(resolve(`public/${imagen3}`),()=>{})
            return
            
        }

        if(verify1 === true && verify2 ===true && verify3 === true){
            const base64_1 = purifyBase64String(newData.imagenes.imagen1)
                await decode(base64_1.base64,{ext:base64_1.ext,fname:`public/upload/${name}`})
                newData.imagenes.imagen1 = `upload/${name+'.'+base64_1.ext}`

            const base64_2 = purifyBase64String(newData.imagenes.imagen2)
                await decode(base64_2.base64,{ext:base64_2.ext,fname:`public/upload/${name}`})
                newData.imagenes.imagen2 = `upload/${name+'.'+base64_2.ext}`

            const base64_3 = purifyBase64String(newData.imagenes.imagen3)
                await decode(base64_3.base64,{ext:base64_3.ext,fname:`public/upload/${name}`})
                newData.imagenes.imagen3 = `upload/${name+'.'+base64_3.ext}`
                
                const accesorie = await AccesoriosMobiles.findByIdAndUpdate(id,newData)

                res.json(accesorie)
                const accJson = accesorie?.toJSON()
                
                const imagen1 = accJson?.imagenes.imagen1.replace(`${domains.backend_cellunatic}/`,'')
                unlink(resolve(`public/${imagen1}`),()=>{})

                const imagen2 = accJson?.imagenes.imagen2.replace(`${domains.backend_cellunatic}/`,'')
                unlink(resolve(`public/${imagen2}`),()=>{})
                
                const imagen3 = accJson?.imagenes.imagen3.replace(`${domains.backend_cellunatic}/`,'')
                unlink(resolve(`public/${imagen3}`),()=>{})
                return
        }

        const accesorie = await AccesoriosMobiles.findByIdAndUpdate(id,newData)

        res.json(accesorie)
        
    }catch(err){
        console.log(err)
        res.json()
    }
}
