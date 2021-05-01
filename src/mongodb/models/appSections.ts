import {Schema,model} from 'mongoose'

const section = new Schema({
    title:{
        type:String,
        trim:true,
        required:true,
        unique:true
    },
    url:{
        type:String,
        trim:true,
        unique:true
    },
    description:{
        type:String
    },
    keywords:{
        type:String,
        trim:true
    }
},{timestamps:true,versionKey:false})

export default model('Section',section)