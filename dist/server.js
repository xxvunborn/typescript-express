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
require('dotenv').config(); // Set env from the config when the server start
const http_1 = __importDefault(require("http"));
const services_1 = __importDefault(require("./services"));
const express_1 = __importDefault(require("express"));
const middleware_1 = __importDefault(require("./middleware"));
const typeorm_1 = require("typeorm");
const helpers_1 = require("./helpers");
// Define the enviroment and set variables for .env
const enviroment = process.env.NODE_ENV || 'development';
const stage = require('./config')[enviroment];
typeorm_1.createConnection().then((connection) => __awaiter(this, void 0, void 0, function* () {
    const router = express_1.default();
    helpers_1.applyMiddleware(middleware_1.default, router);
    helpers_1.applyRoutes(services_1.default, router);
    const server = http_1.default.createServer(router);
    server.listen(stage.port, () => {
        console.log(`Server is running on http://localhost:${stage.port}`);
    });
})).catch(error => console.log("TypeORM connection error:", error));
//# sourceMappingURL=server.js.map