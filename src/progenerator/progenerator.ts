
    import { createConnection } from "typeorm";
    import { Request, Response } from "express";
    
    import * as express from "express";
    
    export default class ProGeneratorApp {
    
    static run({ routes, admin, docs, middleware, port }: any): void {
        createConnection()
         .then(async(connection) => {
             const app = express();
             const http = require("http");
             const server = http.createServer(app)
             middleware.forEach((middleWare: any) => {
                 app.use((req, res, next) => middleWare(req, res, next, { server, app }))
            })
            routes.concat(admin || []).concat(docs || []).forEach((route: any) => {
                (app as any)[route.method](
                    route.route,
                    (req: Request, res: Response, next: Function) => {
                        const result = new(route.controller as any)()[route.action](
                    req,
                    res,
                    next
                );
                if (result instanceof Promise) {
                    result.then((result) =>
                       result !== null && result !== undefined ?
                        route.view ? res.sendFile(route.view) : res.send(result) :
                        undefined
                    );
                } else if (result !== null && result !== undefined) {
                    if (route.view) {
                        res.sendFile(route.view);
                                            } else {
                        res.json(result)
                       }
                   }
                    }
                );
            });
    
             app.get("/", (req, res) => {
                 res.json("index.html");
            });
    
            server.listen(port);
    
             console.log("Server has started on port: " + process.env.PORT);
         })
          .catch((error) => console.log(error));}}
    