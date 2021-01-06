import env from 'dotenv'

env.config()

export const mongodb={
        uri: process.env.MONGODB_URI || 'mongodb://localhost/cellunatic',
    }
export const express={
        port: process.env.PORT || 4000,
        domains:{
            backend_cellunatic: process.env.CELLUNATIC_BACKEND_URI || 'http://localhost:3001'
        }
    }