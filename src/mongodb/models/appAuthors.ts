import {Schema,model} from 'mongoose'

const author = new Schema({
    fullName:{
        type:String,
        trim:true,
        required:true
    },
    biography:{
        type:String
    },
    photo:{
        type:String,
        trim:true
    },
    phone:{
        type:String,
        trim:true
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true
    }
},{timestamps:true,versionKey:false})

export default model('Author',author)