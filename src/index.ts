import {App} from './express/app'
import {express} from './config'

import './mongodb/connection.mongoose'

async function main(){
    const port= express.port
    const app = new App(port)
    app.listen()
}

main()