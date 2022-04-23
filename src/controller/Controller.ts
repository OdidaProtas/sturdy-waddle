import { NextFunction, Request, Response } from "express";
import { Wallet } from "../crypto/Crypto";
import createRoute from "../helpers/createRoute";

export default class CryptoController {
    transact() {
        const satoshi = new Wallet();
        const bob = new Wallet();
        const alice = new Wallet()

        satoshi.sendMoney(50, bob.publicKey);
        bob.sendMoney(23, alice.publicKey)
        alice.sendMoney(10, bob.publicKey);
        bob.sendMoney(13, satoshi.publicKey)
    }

    async save(req: Request, res: Response, next: NextFunction) {
        const satoshi = new Wallet()
        return satoshi;
    }
}



export const CryptoRoutes = [
    createRoute("post", "/create-wallet", CryptoController, "save")
]