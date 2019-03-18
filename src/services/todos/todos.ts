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
