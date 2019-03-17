require('dotenv').config(); // Set env from the config when the server start

import http from 'http'
import routes from './services'
import express from 'express'
import middleware from './middleware'
import { createConnection } from 'typeorm'
import { applyMiddleware, applyRoutes } from './helpers'


// Define the enviroment and set variables for .env
const enviroment = process.env.NODE_ENV || 'development'
const stage = require('./config')[enviroment]

createConnection().then(async connection => {

const router = express()
applyMiddleware(middleware, router)
applyRoutes(routes, router)

const server = http.createServer(router)

server.listen(stage.port, () => {
  console.log(`Server is running on http://localhost:${stage.port}`)
})

}).catch(error => console.log("TypeORM connection error:", error));

