import {RequestHandler} from 'express'
import { unlink } from 'fs'
import { resolve } from 'path'
import AccesoriosMobiles from '../../mongodb/models/accesorios.mobiles'
import ProductosMobiles from '../../mongodb/models/productos.mobiles'
import {express} from '../../config'
import { crearURL } from '../../plugins/string_to_slug'
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

export const getByUrl:RequestHandler = async(req,res)=>{
    try{
        const producto = await ProductosMobiles.findOne({url:req.params.url})
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
        newData.url = crearURL(newData.nombre)
        const createData = new ProductosMobiles(newData)
        const saveData = await createData.save()
        res.json(saveData)
    }
    catch(err){
        if(err.code == 11000){
            res.json('producto existente')
            return
        }
        console.log(err)
    }
}

export const getBySeccion:RequestHandler = async(req,res)=>{
    console.log(req.params.seccion)
    try{
        const productos = await ProductosMobiles.find({seccion:req.params.seccion})
        res.json(productos)
    }
    catch(err){
        console.log(err)
        res.json()
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
    }
    catch(err){
        console.log(err)
        res.json()
    }
}