"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyMiddleware = (middleware, router) => {
    for (const f of middleware) {
        f(router);
    }
};
exports.applyRoutes = (routes, router) => {
    for (const route of routes) {
        const { method, path, handler } = route;
        router[method](path, handler);
        // same as route.method(path, handler)
        //         route.get(path, handler)v
        //         route.post(path, handler)
        //         ...
    }
};
//# sourceMappingURL=index.js.map