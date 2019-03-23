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

and in this file we add the next code:
```
{
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": "acidlabs",
  "password": "",
  "database": "test",
  "synchronize": false,
  "migrationsRun": true,
   "logging": false,
   "entities": [
      "dist/services/**/entity/*.js"
   ],
   "migrations": [
      "dist/services/**/migration/*.js"
   ],
   "subscribers": [
      "dist/services/**/subscriber/*.js"
   ],
   "cli": {
      "entitiesDir": "src/services/**/entity",
      "migrationsDir": "src/services/**/migration",
      "subscribersDir": "src/services/**/subscriber"
   }
}
```

In this file we need to define the the `Dir` for `entities`, `migration` and `subscribers` this for the cli and for the `dist` folder since the compilation files live here

We create a simple `TODO` for that, in the service folder we need to create a todo folder and the `entity` and `migration` folder

```
mkdir src/todos/
mkdir src/todos/entity/
mkdir src/todos/migration/
```

Now, create `Todo.ts` for define the entity for `todo`

```
touch ./src/todos/entity/Todo.ts
```

TypeORM use entity for data structure, so we need to define 3 columns, the `id`, `name` and `isComplete`

```
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  public id: number | undefined;

  @Column()
  public name: string = '';

  @Column()
  public isComplete: boolean = false
}

export default Todo;
```

and the migrations for this entity to the DB.

```
import {MigrationInterface, QueryRunner} from "typeorm";

export class Initialize1552935166867 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE TABLE "todo" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "isComplete" boolean NOT NULL, CONSTRAINT "PK_d429b7114371f6a35c5cb4776a7" PRIMARY KEY ("id"))`);
    }

  public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query(`DROP TABLE "todo"`);
    }

}
```

for run the migration and the drop, we can use the next commands

```
./node_modules/.bin/typeorm schema:run
./node_modules/.bin/typeorm schema:drop 
```

And finally, we need to create the function for read and post the TODOs in the `./src/entity/todos.ts`

```
import {Request, Response} from "express";
import { getManager } from 'typeorm';
import Todo from './entity/Todo';

export async function readTodo (req: Request, res: Response) {
  // Get Todo repository to perform operations with todo
  const todoRepository = await getManager().getRepository(Todo);

  // Load todo by a given todo id 
  const todo = await todoRepository.findOne(req.params.id)

  // if post was not found return 404 to the client
  // TODO: use decorator syntax for this
  if (!todo) {
    res.status(404)
    res.end()
    return;
  }
  res.send(todo)
}

export async function postTodo (req: Request, res: Response) {
  // Get Todo repository to perform operation with todo
  const todoRepository = await getManager().getRepository(Todo);

  // create a todo object from todo json object send over http
  const newTodo = todoRepository.create(req.body)

  // Save todo
  await todoRepository.save(newTodo)

  // Response
  res.send(newTodo)
}
```

and we define the routes in the file `./src/services/routes.ts`

```
import { Request, Response } from "express"
import { readTodo, postTodo } from './todos'

export default [
  {
    path: "/read/:id",
    method: "get",
    handler: readTodo
  },
  {
    path: "/post",
    method: "post",
    handler: postTodo
  }
]
```

Then, run:

```
npm run dev
```
