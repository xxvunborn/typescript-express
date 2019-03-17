# WORK IN PROGRESS, spanglish comments and not finish worked setup
# JWS-Auth with typescript

## First configurations

first, inicialize the proyect with  
`npm init -y`

then install typescript with tsc-watch (a compiler for typescript with the flag --watch)
`npm install i typescript tsc-watch`

we can configure `tsc-watch` when every time you chenge a file tsc compile the files and restart the server

in `package.json` add the next script 
```
"scripts": {
   "dev": "tsc-watch --onsuccess \"node ./dist/server.js\""
}
```

then we need to add the configuration for the typescript compiler
```
npx tsc --init --moduleResolution node --resolveJsonModule --target es6 --noImplicitAny --sourceMap --lib dom,es2017 --outDir dist
```

For working with typescript we need the packages and the typescript module, the next packages for this proyects:
```
npm i express@5.0.0-alpha.7 @types/express
npm i jsonwebtoken @types/jsonwebtoken
npm i body-parser @types/body-parser
npm i compression @types/compression 
npm i dotenv @types/dotenv
npm i cors @types/cors 
npm i @types/node
```

then create the folder what store the server
```
mkdir src
touch ./src/server.ts
```

first create the .env file for using `dotenv`
```
NODE_ENV=development
PORT=3000
```

Next, create the `src/configure.ts` for configure the enviroment variables for every enviroment (only development for now)

```
module.exports = {
  development: {
    port: process.env.PORT || 3000
  }
}
```

for the next task we will create a server for testing the configuration we made

```
require('dotenv').config(); // Set env from the config when the server start

import http from 'http'
import express from 'express'

const router = express()
const server = http.createServer(router)

// Define the enviroment and set variables for .env
const enviroment = process.env.NODE_ENV || 'development'
const stage = require('./config')[enviroment]

router.use('/api/v1', (req, res, next) => {
  res.send('Hello');
  next()

})

server.listen(stage.port, () => {
  console.log(`Server is running on http://localhost:${stage.port}`)
})
```

# Middleware
For the middleware section we use `cors`, `body-parser` and `compression`. for that, we need to create the next folder and file

```
mkdir src/middleware
touch ./src/middleware/common.ts
touch ./src/middleware/index.ts
```

then in `common.ts` we add the next code.

```
import { Router } from "express"
import cors from "cors"
import parser from "body-parser"
import compression from "compression"

export const handleCors = (router: Router) => {
router.use(
  cors({
    credentials: true,
    origin: true
  })
)};

export const handleBodyParser = (router: Router) => {
router.use(
  parser.urlencoded({ extended: true })
)

router.use(
  parser.json()
)};

export const handleCompression = (router: Router) => {
  router.use(
    compression()
  )
};

```

and we export in `index.ts` from `middleware`

```
import {
  handleCors,
  handleBodyParser,
  handleCompression
} from './common'

export default [handleCors, handleBodyParser, handleCompression]
```

# Services (and routes)
then we need to create the routes for the application, for that, create a new folder called services, in this folder we can store the index and the interaction with the DB in the future

```
mkdir src/services
touch ./src/services/index.ts
```

and create a test service, in this case hello world service

```
mkdir src/services/helloWorld
touch ./src/services/helloWorld/routes.ts
```


then in `helloWorld/routes.ts` add the next code:
```
import { Request, Response } from "express"

export default [
  {
    path: "/",
    method: "get",
    handler: async (req: Request, res: Response) => {
      res.send("Hello World");
    }
  }
]
```

and then, in the index of services, we export the `helloWorld` 
```
import helloWorld from "./helloWorld/routes"

export default [...helloWorld]
```

For the next task, we need to agregate the routes in the `server.ts`, for that we need to create a helper function for read the routes in the service folder.

```
mkdir src/helpers/
touch ./src/helpers/index.ts
```

and in the index.ts we add the next code

```
import { Router, Request, Response, NextFunction } from "express"

type Handler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

type Route = {
  path: string;
  method: string;
  handler: Handler | Handler[];
}

export const applyRoutes = (routes: Route[], router: Router) => {
  for (const route of routes) {
    const { method, path, handler } = route;
    (router as any )[method](path, handler)
  }
}
```

```
En esta linea lo que esta haciendo es que esta declarando un Express.Router y luego le esta asignadndo el tipo de metodo (get,post,etc..) y pasando como parametros el path y el handler del method, seria mejor explicarlo y apoyarse de la documentación de express para que quede un mayor entendimiento de la guia 
(router as any )[method](path, handler)
```

run the app and check every is ok,

```
npm run dev
```

# TypeORM
for DB, i dicide to use postgres, and for mangage the migrations and the virtual DB we use typeORM

We need the next libreries for use `pg` and `typeORM`
```
npm install pg
npm install @types/pg
npm install typeorm
npm install reflect-metadata
```

TypeORM use a experimental typescript decorator syntax, for more information you can read this [article](https://www.spectory.com/blog/A%20deep%20dive%20into%20TypeScript%20decorators)

for use this experimental decorator we need to include the next code in the end of the `tsconfig.json`

```
  ...
"emitDecoratorMetadata": true,
"experimentalDecorators": true
```

we dont use the cli for typescript, so we create a new file called 
```
touch ./ormconfig.json

```








