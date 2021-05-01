import {RequestHandler} from 'express'
import Secciones from '../../mongodb/models/appSections'
import { crearURL } from '../../plugins/string_to_slug'

export const getAll:RequestHandler = async(req,res)=>{
    try{
        const secciones = await Secciones.find()
        res.json(secciones)
    }
    catch(err){
        console.log(err)
        res.json([])
    }
}

export const getByUrl:RequestHandler = async(req,res)=>{
    try{
        const seccion = await Secciones.findOne({url:req.params.url})
        res.json(seccion)
    }
    catch(err){
        console.log(err)
        res.json()
    }
}

export const create:RequestHandler = async(req,res)=>{
    try{
        const {newData} = req.body
        newData.url = crearURL(newData.title)

        const createData = new Secciones(newData)
        const saveData = await createData.save()
        res.json(saveData)
    }
    catch(err){
        if(err.code == 11000){
            res.json('seccion existente')
            return
        }
        console.log(err)
    }
}

export const updateSection:RequestHandler = async(req,res)=>{
    try{
        const {id,newData} = req.body
        const secciones = await Secciones.findByIdAndUpdate(id,newData)
        const lastData = await secciones?.toJSON()
        
        res.json(secciones)

    }
    catch(err){
        console.log(err)
        res.json()
    }
}

export const remove:RequestHandler = async(req,res)=>{
    try{
        const seccion = await Secciones.findByIdAndDelete(req.params.id)
        const deleted = seccion?.toJSON()
        res.json(seccion)        
    }
    catch(err){
        console.log(err)
        res.json()
    }
}