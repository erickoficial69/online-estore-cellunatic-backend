import {RequestHandler} from 'express'
import Usuarios from '../../mongodb/models/usuarios'

export const createUser:RequestHandler = async(req,res)=>{
    try{
        const user = new Usuarios(req.body)
        const created = await user.save()
        res.status(200).json(created)
    }catch(err){
        console.log(err)
        res.status(500).json()
    }
}

export const deleteUser:RequestHandler = async(req,res)=>{
    try{
        const user = await Usuarios.findByIdAndDelete(req.body.id)
        res.status(200).json(user)
    }catch(err){
        console.log(err)
        res.status(500).json()
    }
}

export const updateUser:RequestHandler = async (req,res)=>{
    const {newData} = req.body
    try{
        const user = await Usuarios.findByIdAndUpdate(newData._id,newData,{new:true})
        res.status(200).json(user)
    }
    catch(err){
        console.log(err)
        res.status(500).json()
    }
}

export const getUser:RequestHandler = async(req,res)=>{
    const {param} = req.body
        
    try{
        const user = await Usuarios.findOne(param)
        res.status(200).json(user)
    }catch(err){
        console.log(err)
        res.status(500).json()
    }
}