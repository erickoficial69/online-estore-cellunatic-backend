import {Schema,model} from 'mongoose'

const accesorio = new Schema({
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
    description:{
        type:String
    },
    keywords:{
        type:String
    },
    color:{
        type:String,
        index:true
    },
    estado:{
        type:Boolean,
        default:true
    },
    url:{
        type:String,
        trim:true,
        unique:true
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
        type:Number,
        default:0
    },
    compras:{
        type:Number
    },
    precio:{
        type:Number
    }
},{timestamps:true,versionKey:false})


export default model('Accesorio',accesorio)