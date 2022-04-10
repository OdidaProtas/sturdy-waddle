import { NextFunction, Request, Response } from "express";
import * as zip from "express-easy-zip";
import * as cors from "cors";
import * as bodyParser from "body-parser";

export default class MiddleWare {
  apply() {
    return [bodyParser.json(), cors("*" as any), zip()];
  }

  async pass(request: Request, response: Response, next: NextFunction) {
    next();
  }
}
