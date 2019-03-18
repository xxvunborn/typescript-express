"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const todos_1 = require("./todos");
exports.default = [
    {
        path: "/read",
        method: "get",
        handler: todos_1.readTodo
    },
    {
        path: "/post",
        method: "post",
        handler: todos_1.postTodo
    }
];
//# sourceMappingURL=routes.js.map