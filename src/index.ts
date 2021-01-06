import {App} from './express/app'
import {express} from './config'

import './mongodb/connection.mongoose'

async function main(){
    const app = new App(express.port)
    await app.listen()
}

main()