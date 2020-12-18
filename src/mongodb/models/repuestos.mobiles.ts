import {Schema,model} from 'mongoose'

const repuesto = new Schema({
    nombre:{
        type:String,
        trim:true,
        index:true
    },
    modelo:{
        type:String,
        index:true
    },
    producto:{
        type:String,
        index:true
    },
    color:{
        type:String,
        index:true
    },
    estado:{
        type:Boolean,
        default:true
    },
    imagenes:{
        imagen1:{
            type:String
        },
        imagen2:{
            type:String
        },
        imagen3:{
            type:String
        }
    },
    visitas:{
        type:Number
    },
    compras:{
        type:Number
    },
    precio:{
        type:Number
    }
},{timestamps:true,versionKey:false,autoIndex:true})

export default model('Repuesto',repuesto)