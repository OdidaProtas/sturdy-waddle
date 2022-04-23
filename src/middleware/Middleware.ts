import { NextFunction, Request, Response } from "express";
import * as zip from "express-easy-zip";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import Mpesa from "../entity/Mpesa";

export default class MiddleWare {
  apply() {
    return [bodyParser.json(), cors("*" as any), zip(), this.mpesaMiddleWare];
  }

  async pass(request: Request, response: Response, next: NextFunction) {
    next();
  }


  async mpesaMiddleWare(request: Request, response: Response, next: NextFunction) {
    request["lipaNaMpesa"] = Mpesa.requestPayment
    next();
  }

}
