require('dotenv').config(); // Set env from the config when the server start

import http from 'http'
import express from 'express'
import cors from 'cors'
import parser from 'body-parser'
import compression from 'compression'


// Define the enviroment and set variables for .env
const enviroment = process.env.NODE_ENV || 'development'
const stage = require('./config')[enviroment]

const router = express()

// Define middlewares for the application
// Cors
router.use(
    cors({
      credentials: true,
      origin: true
    })
)

// Body-parser
router.use(
parser.urlencoded({ extended: true })
)
router.use(
  parser.json()
)

// Compression
router.use(
  compression()
)


const server = http.createServer(router)

router.use('/api/v1', (req, res, next) => {
  res.send('Hello');
  next()
})

server.listen(stage.port, () => {
  console.log(`Server is running on http://localhost:${stage.port}`)
})


