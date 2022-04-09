
                        import { NextFunction, Request, Response } from "express";
    
    import * as cors from "cors";
    import * as bodyParser from "body-parser";
    
    export default class MiddleWare {
        
    
      apply() {
        return [
          bodyParser.json(),
          cors("*" as any),
        ]
      }
        
      async pass(request: Request, response: Response, next: NextFunction) {
        next();
      }
    }
    