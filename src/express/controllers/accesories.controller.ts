import {RequestHandler} from 'express'
import {decode} from 'node-base64-image'
import {unlink} from 'fs'
import {resolve} from 'path'
import AccesoriosMobiles from '../../mongodb/models/accesorios.mobiles'
import { purifyBase64String, verifyBase64String } from '../app'
import {express} from '../../config'
import { crearURL } from '../../plugins/string_to_slug'
const {domains} = express

export const getAll:RequestHandler = async(req,res)=>{
    let limit:number = req.params.limit?parseInt(req.params.limit):10
    try{
        const accesorios = await AccesoriosMobiles.find().limit(limit).sort({updatedAt:-1})
        res.json({accesorios,count:accesorios.length})
        
    }catch(err){
        res.send()
    }
}

export const getByUrl:RequestHandler = async(req,res)=>{
    if(req.params.url){
        try{
            const accesorio = await AccesoriosMobiles.findOne({url:req.params.url}).limit(1)
            if(accesorio){
                const {producto,visitas} = await accesorio.toJSON()
                
                const relacionados = await AccesoriosMobiles.find({producto}).limit(6).sort({visitas:-1})
                if(visitas){
                    await AccesoriosMobiles.findOneAndUpdate({url:req.params.url},{
                        visitas:visitas+1
                    },{new:true})
                }else{
                    await AccesoriosMobiles.findOneAndUpdate({url:req.params.url},{
                        visitas:1
                    },{new:true})
                }
                
                return res.json({accesorio,relacionados})
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
    if(search !=='' && search != undefined){
    const param = search.replace(' ','|').replace('-','|')
        try{

            const accesorios = await AccesoriosMobiles.find(
                {$or:[
                    {nombre:{$regex:param}},
                    {color:{$regex:param}},
                    {producto:{$regex:param}},
                    {modelo:{$regex:param}}
            ]}
            ).limit(limit?parseInt(limit):10).sort({createdAt:-1})
            
           if(accesorios){
               
               return res.json({accesorios,count:accesorios.length})
           }
        }catch(err){
            console.log(err)
            res.json({accesorios:[],count:0})
        }
    }
    const accesorios = await AccesoriosMobiles.find().limit(limit?parseInt(limit):10).sort({createdAt:-1})
    
    res.json({accesorios,count:accesorios.length})
}


export const newAccesorio:RequestHandler  = async(req,res)=>{
    const {newAccesorio} = req.body
    const {imagenes} = newAccesorio

    const name = Date.now()

    try{
        /* if(imagenes.imagen1!==''){
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
        } */

        const url_actual = crearURL(newAccesorio.nombre)
        newAccesorio.url = url_actual
        const existe = await AccesoriosMobiles.findOne({url:url_actual})
        if(existe !== null){
            console.log(existe)
            newAccesorio.url +='_1'
            const newData = new AccesoriosMobiles(newAccesorio)
            const saved = await newData.save()
            res.json(saved)
            return
        }
        const newData = new AccesoriosMobiles(newAccesorio)    
    
        const saved = await newData.save()
        res.json(saved)
    }catch(err){
        console.log(err)
        res.json()
    }
}

export const deleteAccesorio:RequestHandler = async(req,res)=>{
    try{
        const forRemove = await AccesoriosMobiles.findById(req.params.id)
        let data = forRemove?forRemove.toJSON():null
        const accesorio = await AccesoriosMobiles.findByIdAndDelete(req.params.id)
        res.json(accesorio)
        
        /* if(data.imagenes.imagen1!==""){
            unlink(resolve(`public/${data.imagenes.imagen1}`),()=>{})
        }
        if(data.imagenes.imagen2!==""){
            
            unlink(resolve(`public/${data.imagenes.imagen2}`),()=>{})
        }
        if(data.imagenes.imagen3 !==""){
            
            unlink(resolve(`public/${data.imagenes.imagen3}`),()=>{})
        } */
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

            const accesorio = await AccesoriosMobiles.findByIdAndUpdate(id,newData)

            res.json(accesorio)
            const accJson = accesorio?.toJSON()
            
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
            
            const accesorio = await AccesoriosMobiles.findByIdAndUpdate(id,newData)

            res.json(accesorio)
            const accJson = accesorio?.toJSON()
            
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

            const accesorio = await AccesoriosMobiles.findByIdAndUpdate(id,newData)

            res.json(accesorio)
            const accJson = accesorio?.toJSON()
            
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
            
            const accesorio = await AccesoriosMobiles.findByIdAndUpdate(id,newData)

            res.json(accesorio)
            const accJson = accesorio?.toJSON()
            
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

            const accesorio = await AccesoriosMobiles.findByIdAndUpdate(id,newData)

            res.json(accesorio)
            const accJson = accesorio?.toJSON()
            
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
            
            const accesorio = await AccesoriosMobiles.findByIdAndUpdate(id,newData)

            res.json(accesorio)
            const accJson = accesorio?.toJSON()
            
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
                
                const accesorio = await AccesoriosMobiles.findByIdAndUpdate(id,newData)

                res.json(accesorio)
                const accJson = accesorio?.toJSON()
                
                const imagen1 = accJson?.imagenes.imagen1.replace(`${domains.backend_cellunatic}/`,'')
                unlink(resolve(`public/${imagen1}`),()=>{})

                const imagen2 = accJson?.imagenes.imagen2.replace(`${domains.backend_cellunatic}/`,'')
                unlink(resolve(`public/${imagen2}`),()=>{})
                
                const imagen3 = accJson?.imagenes.imagen3.replace(`${domains.backend_cellunatic}/`,'')
                unlink(resolve(`public/${imagen3}`),()=>{})
                return
        }

        const accesorio = await AccesoriosMobiles.findByIdAndUpdate(id,newData)

        res.json(accesorio)
        
    }catch(err){
        console.log(err)
        res.json()
    }
}
