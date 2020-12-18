import env from 'dotenv'

env.config()

export const mongodb={
        database: process.env.MONGODB_CELLUNATIC || 'cellunatic',
        host: process.env.MONGODB_HOST || 'localhost',
        user: process.env.MONGODB_USER ||'admin',
        pass: process.env.MONGODB_PASS || 'admin'
    }
export const express={
        port: process.env.EXPRESS_PORT? process.env.PORT : 3001,
        domains:{
            backend_cellunatic: process.env.CELLUNATICBACKEND || 'http://localhost:3001'
        }
    }