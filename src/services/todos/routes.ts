import { Request, Response } from "express"
import { readTodo, postTodo } from './todos'

export default [
  {
    path: "/read",
    method: "get",
    handler: readTodo
  },
  {
    path: "/post",
    method: "post",
    handler: postTodo
  }
]
