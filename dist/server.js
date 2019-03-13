"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config(); // Set env from the config when the server start
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const compression_1 = __importDefault(require("compression"));
// Define the enviroment and set variables for .env
const enviroment = process.env.NODE_ENV || 'development';
const stage = require('./config')[enviroment];
const router = express_1.default();
// Define middlewares for the application
// Cors
router.use(cors_1.default({
    credentials: true,
    origin: true
}));
// Body-parser
router.use(body_parser_1.default.urlencoded({ extended: true }));
router.use(body_parser_1.default.json());
// Compression
router.use(compression_1.default());
const server = http_1.default.createServer(router);
router.use('/api/v1', (req, res, next) => {
    res.send('Hello');
    next();
});
server.listen(stage.port, () => {
    console.log(`Server is running on http://localhost:${stage.port}`);
});
//# sourceMappingURL=server.js.map