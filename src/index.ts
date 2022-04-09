
    import "reflect-metadata";
    import * as dotenv from "dotenv";
    
    import ProGeneratorApp from "./progenerator/progenerator";
    import MiddleWare from "./middleware/Middleware";
    
    import { Routes } from "./routes";
    
    dotenv.config();
    
    ProGeneratorApp.run({
        routes: Routes,
        middleware: new MiddleWare().apply(),
        port: process.env.PORT,
    });
    
    