import {RequestHandler} from 'express'
import { unlink } from 'fs'
import { resolve } from 'path'
import AccesoriosMobiles from '../../mongodb/models/accesorios.mobiles'
import ProductosMobiles from '../../mongodb/models/productos.mobiles'
import {express} from '../../config'
const {domains} = express

export const getAll:RequestHandler = async(req,res)=>{
    try{
        const productos = await ProductosMobiles.find()
        res.json(productos)
    }
    catch(err){
        console.log(err)
        res.json([])
    }
}

export const getById:RequestHandler = async(req,res)=>{
    try{
        const producto = await ProductosMobiles.findById(req.params.id)
        res.json(producto)
    }
    catch(err){
        console.log(err)
        res.json()
    }
}

export const create:RequestHandler = async(req,res)=>{
    try{
        const {newData} = req.body
        const createData = new ProductosMobiles(newData)
        const saveData = await createData.save()
        res.json(saveData)
    }
    catch(err){
        res.json({})
        console.log(err)
    }
}

export const updateProduct:RequestHandler = async(req,res)=>{
    try{
        const {id,newData} = req.body
        const productos = await ProductosMobiles.findByIdAndUpdate(id,newData)
        const lastData = await productos?.toJSON()
        
        res.json(productos)
        await AccesoriosMobiles.updateMany({producto:lastData.nombre},{producto:newData.nombre})

    }
    catch(err){
        console.log(err)
        res.json()
    }
}

export const remove:RequestHandler = async(req,res)=>{
    try{
        const producto = await ProductosMobiles.findByIdAndDelete(req.params.id)
        const deleted = producto?.toJSON()
        res.json(producto)
        const searchsFiles = await AccesoriosMobiles.find({producto:deleted.nombre})

        searchsFiles.map(async doc =>{
            const document = await doc.toJSON()
            if(document.imagenes.imagen1!=='') unlink(resolve(`public/${document.imagenes.imagen1.replace(domains.backend_cellunatic,'')}`),()=>{})
            if(document.imagenes.imagen2!=='') unlink(resolve(`public/${document.imagenes.imagen2.replace(domains.backend_cellunatic,'')}`),()=>{})
            if(document.imagenes.imagen3!=='') unlink(resolve(`public/${document.imagenes.imagen3.replace(domains.backend_cellunatic,'')}`),()=>{})
            await AccesoriosMobiles.findOneAndDelete({producto:deleted.nombre})
        })
        
    }
    catch(err){
        console.log(err)
        res.json()
    }
}