
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
        const [project,] = await useTryCatch(this.ur.findOne())
        if (project !== null || project !== undefined) {
            project.projectCount = project.projectCount + 1;
            await useTryCatch(this.ur.save(project))
        } else {
            await useTryCatch(this.ur.save({ projectCount: 1 }))
        }
        res.sendStatus(200)
    }


    async getCount(req: Request, res: Response, next: NextFunction) {
    }

}


export const UserRoutes = [
    createRoute("post", "/generator", UserController, "genP"),
    createRoute("get", "/project/:name", UserController, "getProject"),
    createRoute("get", "/count", UserController, "getCount")
]
