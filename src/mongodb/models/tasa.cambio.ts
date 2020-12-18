import {Schema,model} from 'mongoose'

const tasaCambio = new Schema({
    monto:{
        type:Number,
        trim:true,
        default:2
    }
},{timestamps:true,versionKey:false})

export default model('TasaCambio',tasaCambio)