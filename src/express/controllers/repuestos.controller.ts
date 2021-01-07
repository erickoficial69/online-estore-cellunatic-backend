import {RequestHandler} from 'express'
import {decode} from 'node-base64-image'
import {unlink} from 'fs'
import {resolve} from 'path'
import RepuestosMobiles from '../../mongodb/models/repuestos.mobiles'
import { purifyBase64String, verifyBase64String } from '../app'
import {express} from '../../config'
const {domains} = express

export const getAll:RequestHandler = async(req,res)=>{
    let limit:number = req.params.limit?parseInt(req.params.limit):10
    try{
        const repuestos = await RepuestosMobiles.find().limit(limit).sort({updatedAt:-1})
        res.json({repuestos,count:repuestos.length})
    }catch(err){
        res.send()
    }
}

export const getById:RequestHandler = async(req,res)=>{

    if(req.params.id){
        try{
            const repuesto = await RepuestosMobiles.findById(req.params.id).limit(1)
            if(repuesto){
                const {producto,visitas} = await repuesto.toJSON()
                const relacionados = await RepuestosMobiles.find({producto}).limit(6).sort({visitas:-1})
                await RepuestosMobiles.findByIdAndUpdate(req.params.id,{
                    visitas:visitas+1
                },{new:true})
                
                return res.json({repuesto,relacionados})
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

    if(search!==''){
        try{
            const repuestos = await RepuestosMobiles.find(
                {$or:[
                    {nombre:{$regex:search.replace(' ','|')}},
                    {color:{$regex:search.replace(' ','|')}},
                    {producto:{$regex:search.replace(' ','|')}},
                    {modelo:{$regex:search.replace(' ','|')}}
            ]}
            ).limit(limit?parseInt(limit):10).sort({updatedAt:-1})
            if(repuestos){
                return res.json({repuestos,count:repuestos.length})
            }
            res.json()
        }catch(err){
            console.log(err)
            res.json()
        }
    }
    const repuestos = await RepuestosMobiles.find().limit(limit?parseInt(limit):10).sort({updatedAt:-1})
    res.json({repuestos,count:repuestos.length})
}

export const newRepuesto:RequestHandler  = async(req,res)=>{
    const {newRepuesto} = req.body
    const {imagenes} = newRepuesto

    const name = Date.now()

    try{
        const base64_1 = purifyBase64String(imagenes.imagen1)
        await decode(base64_1.base64,{ext:base64_1.ext,fname:`public/upload/${name}`})
        newRepuesto.imagenes.imagen1 = `upload/${name+'.'+base64_1.ext}`
        
        const base64_2 = purifyBase64String(imagenes.imagen2)
        await decode(base64_2.base64,{ext:base64_2.ext,fname:`public/upload/${name+1}`})
        newRepuesto.imagenes.imagen2 = `upload/${name+1+'.'+base64_2.ext}`

        const base64_3 = purifyBase64String(imagenes.imagen3)
        await decode(base64_3.base64,{ext:base64_3.ext,fname:`public/upload/${name+2}`})
        newRepuesto.imagenes.imagen3 = `upload/${name+2+'.'+base64_3.ext}`

        const newData = new RepuestosMobiles(newRepuesto)    
    
        await newData.save()
        res.json(newData)
    }catch(err){
        console.log(err)
        res.json()
    }
}

export const deleteRepuesto:RequestHandler = async(req,res)=>{
    try{
        const forRemove = await RepuestosMobiles.findById(req.params.id)
        let data = forRemove?forRemove.toJSON():null
        const db_result = await RepuestosMobiles.findByIdAndDelete(req.params.id)
        res.json(db_result)
        
        if(data.imagenes.imagen1!==""){
            const imagen1 = data.imagenes.imagen1
            unlink(resolve(`public/${imagen1}`),()=>{})
        }
        if(data.imagenes.imagen2!==""){
            const imagen2 = data.imagenes.imagen2
            unlink(resolve(`public/${imagen2}`),()=>{})
        }
        if(data.imagenes.imagen3 !==""){
            const imagen3 = data.imagenes.imagen3
            unlink(resolve(`public/${imagen3}`),()=>{})
        }
    }catch(err){
        console.log(err)
        res.json()
    }
}

export const updateRepuesto:RequestHandler = async(req,res)=>{
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

            const db_result = await RepuestosMobiles.findByIdAndUpdate(id,newData)

            res.json(db_result)
            const accJson = db_result?.toJSON()
            
            const imagen1 = accJson?.imagenes.imagen1
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
            
            const db_result = await RepuestosMobiles.findByIdAndUpdate(id,newData)

            res.json(db_result)
            const accJson = db_result?.toJSON()
            
            const imagen1 = accJson?.imagenes.imagen1
            unlink(resolve(`public/${imagen1}`),()=>{})

            const imagen2 = accJson?.imagenes.imagen2
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

            const db_result = await RepuestosMobiles.findByIdAndUpdate(id,newData)

            res.json(db_result)
            const accJson = db_result?.toJSON()
            
            const imagen1 = accJson?.imagenes.imagen1
            unlink(resolve(`public/${imagen1}`),()=>{})

            const imagen3 = accJson?.imagenes.imagen3
            unlink(resolve(`public/${imagen3}`),()=>{})
            return
            
        }

        if(verify1 === false && verify2 ===true && verify3 === false){
            
            const base64_2 = purifyBase64String(newData.imagenes.imagen2)
            await decode(base64_2.base64,{ext:base64_2.ext,fname:`public/upload/${name}`})
            newData.imagenes.imagen2 = `upload/${name+'.'+base64_2.ext}`
            
            const db_result = await RepuestosMobiles.findByIdAndUpdate(id,newData)

            res.json(db_result)
            const accJson = db_result?.toJSON()
            
            const imagen2 = accJson?.imagenes.imagen2
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

            const db_result = await RepuestosMobiles.findByIdAndUpdate(id,newData)

            res.json(db_result)
            const accJson = db_result?.toJSON()
            
            const imagen2 = accJson?.imagenes.imagen2
            unlink(resolve(`public/${imagen2}`),()=>{})

            const imagen3 = accJson?.imagenes.imagen3
            unlink(resolve(`public/${imagen3}`),()=>{})
            return
            
        }

        if(verify1 === false && verify2 ===false && verify3 === true){
            
            const base64_3 = purifyBase64String(newData.imagenes.imagen3)
            await decode(base64_3.base64,{ext:base64_3.ext,fname:`public/upload/${name}`})
            newData.imagenes.imagen3 = `upload/${name+'.'+base64_3.ext}`
            
            const db_result = await RepuestosMobiles.findByIdAndUpdate(id,newData)

            res.json(db_result)
            const accJson = db_result?.toJSON()
            
            const imagen3 = accJson?.imagenes.imagen3
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
                
                const db_result = await RepuestosMobiles.findByIdAndUpdate(id,newData)

                res.json(db_result)
                const accJson = db_result?.toJSON()
                
                const imagen1 = accJson?.imagenes.imagen1
                unlink(resolve(`public/${imagen1}`),()=>{})

                const imagen2 = accJson?.imagenes.imagen2
                unlink(resolve(`public/${imagen2}`),()=>{})
                
                const imagen3 = accJson?.imagenes.imagen3
                unlink(resolve(`public/${imagen3}`),()=>{})
                return
        }

        const db_result = await RepuestosMobiles.findByIdAndUpdate(id,newData)

        res.json(db_result)
        
    }catch(err){
        console.log(err)
        res.json()
    }
}
