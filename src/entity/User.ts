
import { Request, Response, NextFunction } from "express"
import createRoute from "../helpers/createRoute";
import { PrimaryGeneratedColumn, Entity, Column, getRepository } from "typeorm"
import { generateProject } from "../generator/generator";
import useTryCatch from "../helpers/useTryCatch";


@Entity()
export default class User {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({
        default: 0
    })
    projectCount: number
}

class UserController {
    private ur = getRepository(User)

    async getProject(req: Request, res: Response, next: NextFunction) {
        try {
            var dirPath = `./${req.params.name}Project`;

            await res["zip"]({
                files: [{
                    path: dirPath,
                    name: `${req.params.name}Project`
                }],
                filename: `${req.params.name}Project.zip`
            });
        } catch (e) {
            res.json({ err: e })
        }


    }

    async genP(req: Request, res: Response, next: NextFunction) {
        generateProject(req.body)
        res.sendStatus(200)
    }


    async getCount(req: Request, res: Response, next: NextFunction) {
        const [pr, pErr] = await useTryCatch(this.ur.findOne())
        if (pr) {
            return pr.projectCount
        } else {
            res.sendStatus(403)
        }
    }

}


export const UserRoutes = [
    createRoute("post", "/generator", UserController, "genP"),
    createRoute("get", "/project/:name", UserController, "getProject"),
    createRoute("get", "/count", UserController, "getCount")
]
