"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Todo_1 = __importDefault(require("./entity/Todo"));
function readTodo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get Todo repository to perform operations with todo
        const todoRepository = yield typeorm_1.getManager().getRepository(Todo_1.default);
        // Load todo by a given todo id 
        const todo = yield todoRepository.findOne(req.params.id);
        // if post was not found return 404 to the client
        // TODO: use decorator syntax for this
        if (!todo) {
            res.status(404);
            res.end();
            return;
        }
        res.send(todo);
    });
}
exports.readTodo = readTodo;
function postTodo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get Todo repository to perform operation with todo
        const todoRepository = yield typeorm_1.getManager().getRepository(Todo_1.default);
        // create a todo object from todo json object send over http
        const newTodo = todoRepository.create(req.body);
        // Save todo
        yield todoRepository.save(newTodo);
        // Response
        res.send(newTodo);
    });
}
exports.postTodo = postTodo;
//# sourceMappingURL=todos.js.map