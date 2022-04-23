
import { Request, Response, NextFunction } from "express"
import createRoute from "../helpers/createRoute";
import useTryCatch from "../helpers/useTryCatch";
import { PrimaryGeneratedColumn, Entity, Column, getRepository, OneToMany, JoinTable } from "typeorm"
import User from "./User";


@Entity()
export default class Customers extends User {

    // ID field of type UUID is included by default on all entities.
    @Column({nullable:true})
    name: string

}

class CustomersController {
    private cR = getRepository(Customers);

    async save(req: Request, res: Response, next: NextFunction) {

        const [data, error] = await useTryCatch(this.cR.save(req.body));
        if (data) return data;
        else res.status(403).json(error);
    }

    async one(req: Request, res: Response, next: NextFunction) {
        const [data, error] = await useTryCatch(this.cR.findOne())
        if (data) return data;
        else res.status(403).json(error);
    }

    async all(req: Request, res: Response, next: NextFunction) {
        if (Boolean(req.query.take) && Boolean(req.query.skip)) {
            // retrieve all Customers records with pagination query parms
            const [data, error] = await useTryCatch(this.cR.findAndCount({
                take: req.query.take as unknown as number,
                skip: req.body.skip as unknown as number
            }))
            if (data) return data;
            else res.status(403).json(error);
        }
        else {
            const [data, error] = await useTryCatch(this.cR.find())
            if (data) return data;
            else res.status(403).json(error)
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {

        const [data, error] = await useTryCatch(this.cR.save(req.body))
        if (data) return data;
        else res.status(403).json(error);
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        const [customers, error] = await useTryCatch(this.cR.findOne(req.params.id))
        const [data, err] = await useTryCatch(this.cR.remove(customers))
        if (data) return data;
        else res.status(403).json(error)
    }




    async customersbyCarts(req: Request, res: Response, next: NextFunction) {
        const [data, error] = await useTryCatch(this.cR.find({ where: { carts: req.params.id } }))
        if (data) return data;
        else res.status(403).json(error)
    }


}


export const CustomersRoutes = [
    createRoute("post", "/Customers", CustomersController, "save"),
    createRoute("get", "/Customers", CustomersController, "all"),
    createRoute("get", "/Customers/:id", CustomersController, "one"),
    createRoute("put", "/Customers", CustomersController, "update"),
    createRoute("delete", "/Customers/:id", CustomersController, "delete"),
    createRoute("get", "/CustomersByCarts/:id", CustomersController, "customersbyCarts"),

]
