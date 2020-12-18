import {RequestHandler} from 'express'
import App from '../../mongodb/models/appData'
import TasaCambio from '../../mongodb/models/tasa.cambio'

export const updateData:RequestHandler = async (req,res)=>{
    const {newData} = req.body
    try{
        const data = await App.findByIdAndUpdate(newData._id,newData,{new:true})
        res.status(200).json(data)
    }
    catch(err){
        console.log(err)
        res.status(500).json()
    }
}
export const createData:RequestHandler = async (req,res)=>{
    const {newData} = req.body
    try{
        const data = new App(newData)
        const savedData = await data.save()
        res.status(200).json(savedData)
    }
    catch(err){
        console.log(err)
        res.status(500).json()
    }
}
export const getData:RequestHandler = async(req,res)=>{        
    try{
        const data = await App.find().limit(1)
        
        res.status(200).json(data[0])
    }catch(err){
        console.log(err)
        res.status(500).json()
    }
}

export const getTasaCambio:RequestHandler = async(req,res)=>{        
    try{
        const tasa = await TasaCambio.find().limit(1).sort({updatedAt:-1})
        console.log(tasa)
        /* if(tasa.length < 1){
            const newTasa = new TasaCambio({monto:1090000})
            await newTasa.save()
            res.status(200).json(newTasa)
            return
        } */
        res.status(200).json(tasa[0])
    }catch(err){
        console.log(err)
        res.status(500).json()
    }
}

export const updateTasaCambio:RequestHandler = async(req,res)=>{
    const {_id,monto} = req.body      
    try{
        const tasa = await TasaCambio.findByIdAndUpdate(_id,{monto},{new:true})
        res.status(200).json(tasa)
    }catch(err){
        console.log(err)
        res.status(500).json()
    }
}