import {RequestHandler} from 'express'
import Dispositivos from '../../mongodb/models/dispositivos'

export const getAll:RequestHandler = async(req,res)=>{
    try{
        const dispositivos = await Dispositivos.find()
        res.json(dispositivos)
    }
    catch(err){
        console.log(err)
        res.json([])
    }
}

export const getById:RequestHandler = async(req,res)=>{
    try{
        const dispositivo = await Dispositivos.findById(req.params.id)
        res.json(dispositivo)
    }
    catch(err){
        console.log(err)
        res.json()
    }
}

export const create:RequestHandler = async(req,res)=>{
    try{
        const {newData} = req.body
        const createData = new Dispositivos(newData)
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
        const dispositivos = await Dispositivos.findByIdAndUpdate(id,newData)
        const lastData = await dispositivos?.toJSON()
        
        res.json(dispositivos)

    }
    catch(err){
        console.log(err)
        res.json()
    }
}

export const remove:RequestHandler = async(req,res)=>{
    try{
        const dispositivo = await Dispositivos.findByIdAndDelete(req.params.id)
        const deleted = dispositivo?.toJSON()
        res.json(dispositivo)        
    }
    catch(err){
        console.log(err)
        res.json()
    }
}