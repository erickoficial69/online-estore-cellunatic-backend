## Configuracion de variable de entorno

export const mongodb={
        uri: process.env.MONGODB_URI || 'mongodb://localhost/cellunatic',
    }
export const express={
        port: process.env.EXPRESS_PORT? process.env.PORT : 3001,
        domains:{
            backend_cellunatic: process.env.CELLUNATIC_BACKEND_URI || 'http://localhost:3001'
        }
    }