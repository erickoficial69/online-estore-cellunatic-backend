import {Schema,model} from 'mongoose'

const dispositivo = new Schema({
    nombre:{
        type:String,
        unique:true,
        trim:true
    },
    url:{
        type:String,
        unique:true,
        trim:true
    }
},{timestamps:true,versionKey:false})

export default model('Dispositivo',dispositivo)