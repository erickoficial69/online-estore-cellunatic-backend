import {Schema,model} from 'mongoose'

const usuario = new Schema({
    nombre:{
        type:String,
        trim:true
    },
    apellido:{
        type:String,
        trim:true
    },
    correo:{
        type:String,
        trim:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    estado:{
        type:Boolean,
        default:false
    },
    foto:{
        type:String,
        trim:true
    },
    rango:{
        type:String,
        trim:true,
        default:'administrador'
    }
},{timestamps:true,versionKey:false})

export default model('Usuario',usuario)