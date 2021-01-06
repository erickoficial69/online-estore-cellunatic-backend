import {connect,ConnectionOptions} from 'mongoose'
import {mongodb} from '../config'

const opts:ConnectionOptions={
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:false
}

export default (async()=>{
    try{
       const db = await connect(mongodb.uri,opts)
        console.log(db.connection.name)
    }
    catch(err){
        console.log(err)
    }
})()