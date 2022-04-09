
import { Request, Response, NextFunction } from "express"
import createRoute from "../helpers/createRoute";
import { PrimaryGeneratedColumn, Entity } from "typeorm"
import { generateProject } from "../generator/generator";


@Entity()
export default class User {
    @PrimaryGeneratedColumn("uuid")
    id: string


}

class UserController {
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

        const columns = [{
            key: "name",
            nullable: false,
            type: "string"
        },
        { key: "email", nullable: false, type: "string" },
        { key: "password", nullable: false, type: "string" }
        ]

        const relations = [{
            entity: "Profile",
            type: "OneToOne",
            columns: [{ key: "age", nullable: false, type: "number" }, { key: "isMarried", default: false, type: "boolean" }]
        }]
        const sampleEntity = { EntityName: "User", columns, relations }

        generateProject(req.body)
        res.sendStatus(200)
    }

}


export const UserRoutes = [
    createRoute("post", "/generator", UserController, "genP"),
    createRoute("get", "/project/:name", UserController, "getProject")
]
