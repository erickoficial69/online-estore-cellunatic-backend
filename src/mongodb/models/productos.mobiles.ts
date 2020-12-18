import {Schema,model} from 'mongoose'

const producto = new Schema({
    nombre:{
        type:String,
        unique:true,
        trim:true
    },
    seccion:{
        type:String,
        default:"accesorios"
    },
    estado:{
        type:Boolean,
    }
},{timestamps:true,versionKey:false})

export default model('Producto',producto)