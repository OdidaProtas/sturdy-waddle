import * as fs from "fs"
import generateReact from "./generateReact"
export function generateProject({ name,
    entities,
    database,
    relations,
    includeReact,
    includeAuth,
    includeDatabase,
    desc,
    includeEmail,
    includeWebsockets,
    project_id,
    userModel,
    includeModels,
    includeMpesa,
    includeGIS }) {


    function createCoordinates(columns: any[], inBody: boolean, inType: boolean,) {
        const isCoodinates = columns.filter((c: any) => c.type === "coordinates" && c.displayType === "point").length > 0;
        const isPointy = columns.filter(f => f.displayType === "point").length > 0
        const isPoly = columns.filter(f => f.displayType === "polygon").length > 0
        if (!isCoodinates) return "";
        if (!inBody && !inType) return `import { ${isPointy ? "Point," : ""}${isPoly ? "MultiPolygon," : ""} } from "geojson";`
        if (inType) return `Index,`
        return `
        if(Boolean(req.body.lng) && Boolean(req.body.lat)){
            // Convert latitude and longitude to GeoJSON point object before. Multiploygons can be imported with shapefiles.
            req["body"]["geometry"] = {
                type:"Point",
                coodinates:[req.body.lng, req.body.lat]
            }
        }
        
        `
    }


    function nearBy(columns: any[], EntityName: string, inImport: boolean, enroute: boolean) {
        const isCoodinates = columns.filter((c: any) => c.type === "coordinates" && c.displayType === "point").length > 0;
        if (!isCoodinates) return ""
        if (inImport) return `getManager,`
        if (enroute) return `createRoute("/get", "${EntityName}ByRadius", ${EntityName}Controller, "byRadius"),`
        return `
        async byRadius${EntityName}(req: Request, res: Response, next: NextFunction) {
            // returns ${EntityName}(s) points within a given radius. lat, lng and rad query params required
            const data = await getManager()
              .createQueryBuilder(${EntityName}, "${EntityName.toLowerCase()}")
              .where(
                \`ST_DWithin(${EntityName}.geometry, ST_MakePoint(\${req.params.lat},$\{req.params.lng})::geography, \${req.params.rad})\`
              )
              .getMany();
            return data;
          }
        `
    }


    fs.opendir(`./${project_id}`, (err, dat) => {
        if (dat) {
            console.log(`A project already exists with the name ${name}Project`)
        } else {


            fs.mkdir(`${project_id}`, (dat) => {
                fs.mkdir(`${project_id}/${name}Project`, () => {


                    fs.appendFile(`./${project_id}/${name}Project/tsconfig.json`,
                        `
        {
            "compilerOptions": {
             "lib": [
                "es5",
                "es6"
                ],
            "target": "esnext",
            "module": "commonjs",
            "moduleResolution": "node",
            "outDir": "./build",
            "emitDecoratorMetadata": true,
            "experimentalDecorators": true,
            "sourceMap": true,
            }
        }
        `, () => { });

                    fs.appendFile(`./${project_id}/${name}Project/README.md`,
                        `
## ${name}Project
#### ${desc}

##### Generated Models 

${entities.map((e: any) => {
                            return `
#### ${e.EntityName}

${includeModels && `##### Columns`}

Field \` id  \`:  \` string  \`- \` uuid  \`

${e.columns.map((c: any) => `Field  \` ${c.key}\` : \`${c.type}\``).join("\n")}

`
                        }).join("\n\n")}


 ${includeModels && `##### Object Relationships`}

${relations.map((r: any) => `Relation \`  ${r.type} \` - \`left: ${r.left} \`,  \`right: ${r.right} \`  `)}

## Routes

${entities.map((e: any) => {
                            const n = e.EntityName
                            return `
\`post - /${n}\` saves and returns one or array of ${n}

\`get - /${n}\` returns all ${n}s. optional take and skip query params ie. ?take=10&skip=20 . Includes relations by default

\`get  - /${n}/:id\` returns one ${n} with matching id. Includes relations by default

\`put  - /${n}\` updates and returns one or array of ${n}  

\`delete /${n}/:id\` deletes ${n} of given id
`
                        })}
        `, () => { })



                    fs.appendFile(`./${project_id}/${name}Project/package.json`,
                        `
{
"name": "${name.toLowerCase()}-project",
"version": "0.0.1",
"description": "${desc || "No description provided for this application"}",
"devDependencies": {
    "@types/body-parser": "^1.19.1",${includeAuth ? `\n"@types/bcrypt": "^5.0.0",` : ""}\n"@types/cors": "^2.8.12","@types/express": "^4.17.13",${includeAuth ? `\n"@types/jsonwebtoken": "^8.5.5",` : ""}
    "@types/node": "^16.11.4",${includeEmail ? `\n"@types/nodemailer": "^6.4.4",` : ""}${includeGIS ? `\n"@types/geojson": "^7946.0.8",` : ""}
    "nodemon": "^2.0.14",
    "ts-node": "^10.1.0",
    "typescript": "^4.3.5"
},
"dependencies": {
        "body-parser": "^1.19.0",
        "cors": "^2.8.5",
        "dotenv": "^10.0.0",
        "reflect-metadata": "^0.1.13",${includeGIS ? `\n"geojson": "^0.5.0",` : ""}${includeAuth ? `\n"jsonwebtoken": "^8.5.1",` : ""}${database === "mssql" ? `\n"mssql": "^8.1.0",` : ""}${(database === "mysql" || database === "mariadb") ? `\n"mysql": "^2.18.1",` : ""}${includeEmail ? `\n"nodemailer": "^6.7.3",` : ""}${(database === "postgres" || database === "cockroach") ? `\n"pg": "^8.7.3",` : ""}${includeWebsockets ? `\n"socket.io": "^4.4.1",` : ""}${database === "sqljs" ? `\n"sql.js": "^1.6.2",` : ""}${database === "sqlite" ? `\n"sqlite3": "^5.0.3",` : ""}
        "express": "^4.17.1",\n${includeDatabase ? `"axios": "^0.26.1",` : ""}
        "typeorm": "^0.2.36"
},
"scripts": {
    "start": "node build/index.js",
    "dev": "nodemon",
    "build": "tsc",
    "mm": "npm run typeorm migration:generate -- -n ${name}",
    "mg": "npm run typeorm migration:run",
    "typeorm": "node --require ts-node/register ./node_modules/typeorm/cli.js"
}
}
`,
                        () => { })
                    fs.appendFile(`./${project_id}/${name}Project/nodemon.json`,
                        `
    {
        "watch": ["src"],
        "ext": ".ts",
        "ignore": [],
        "exec": "ts-node ./src/index.ts"
            }
            `, () => { })

                })

                if (includeDatabase) {
                    if (database === "sqlite") {
                        fs.appendFile(`./${project_id}/${name}Project/db.sqlite`, ``, () => { })
                    }

                    fs.appendFile(`./${project_id}/${name}Project/ormconfig.js`,
                        `
   
//    When debugging, set environment as "debug" to point typeorm to the source folder, otherwise prod to use the build folder
    const ext = process.env.ENVIRONMENT === "debug" ? "src" : "build";
    const app = process.env.ENVIRONMENT === "debug" ? "js": "ts";


    // For sqlite or sqljs, create a db.sqlite file at the root of your app.
    // 1


    module.exports = {
        type: "${database}",
        ${database !== "sqlite" ? `url: process.env.DATABASE,` : `database:"db.sqlite",`}
        logging: false,
        entities: [\`\${ app }/entity/**/*.\${ext}\`],
        migrations: [\`\${ app }/migration/**/*.\${ ext }\`],
        subscribers: [\`\$ { app }/subscriber/**/*.\${ext}\`],
        cli: { entitiesDir:\`\${ app }/entity\`,
        migrationsDir: \`\${ app }/migration\`,
        subscribersDir: \`\${ app }/subscriber\`},
        ssl: false
        // extra: { 
        // ssl: {
        //     rejectUnauthorized: false,
         //   },
        // },
         }
                `, () => { })
                }

                genSRC()

                if (includeReact) {
                    generateReact({ name, entities, relations, project_id })
                }


            })



            function genSRC() {
                fs.mkdir(`./${project_id}/${name}Project/src`, () => {
                    fs.appendFile(`./${project_id}/${name}Project/src/index.ts`, `
        import "reflect-metadata";
        import * as dotenv from "dotenv";
        
        // app startup script
        import ${name}App from "./${name.toLowerCase()}/${name.toLowerCase()}";

        // middleware can be added or modified in this file. 
        import MiddleWare from "./middleware/Middleware";
        
        // entity routes are registered here as an array.
        import { Routes } from "./routes";
        
        dotenv.config();
        
        ${name}App.run({
            routes: Routes,
            middleware: new MiddleWare().apply(),
            port: process.env.PORT || 7072,
        });
        
        `, () => { })
                })
                if (includeAuth) {
                    fs.mkdir(`./${project_id}/${name}Project/src/controller`, () => {

                        fs.appendFile(`./${project_id}/${name}Project/src/controller/Mpesa.ts`, `


// Visit Daraja API docs for more information and to obtain credentials.

import { NextFunction, Request, Response } from "express";
import axios from "axios";
import createRoute from "../helpers/createRoute";
                        
const mpesaAuthUrl = process.env.MPESA_AUTH_URL;
const darajaSandBoxUrl = process.env.STK_PUSH_URL;
                        
                        
export default class Mpesa {
                    
    // sends prompt to users mpesa,
    static async stkPush(auth: any, phone: string, amount: any) {

        let timestamp = getTimestamp();
        let bsShortCode = process.env.MPESA_SHORT_CODE;
        let passkey = process.env.MPESA_PASS_KEY;

        let formattedPass = \`\${bsShortCode}\${passkey}\${timestamp}\`;
        let password = Buffer.from(formattedPass).toString('base64');

        let type = "CustomerPayBillOnline";

        let [partyA, formatErr] = formatPhoneNumber(phone);

        if (formatErr) {
            return 1
        }
        let partyB = process.env.MPESA_SHORT_CODE;
        let callBackUrl = \`\${process.env.HOST_URL}/MpesaHook\`;
                        
        let accountReference = "test";
        let transactionDesc = "test";

        let valAmount = validateAmount(parseInt(amount));


        let data = {
            BusinessShortCode: bsShortCode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: type,
            Amount: valAmount,
            PartyA: partyA,
            PartyB: partyB,
            PhoneNumber: partyA,
            AccountReference: accountReference,
            TransactionDesc: transactionDesc,
            CallBackURL: callBackUrl
        }


        let config = {
            headers: {
                Authorization: auth,
            }
        }

        try {
            await axios.post(darajaSandBoxUrl, data, config).then(res => {
                return [res.data, null]

            }).catch(e => {
                return [null, e['response']['statusText']];
            })

        } catch (e) {
            return [null, e];
        }


    }
                        
    static async requestPayment(phone: any, amount: any) {

        let consumerKey = process.env.MPESA_CONSUMER_KEY;
        let consumerSecret = process.env.MPESA_CONSUMER_SECRET;

        let buffer = Buffer.from(consumerKey + ":" + consumerSecret);

        let auth = \`Basic \${buffer.toString("base64")}\`;

        try {
            let { data } = await axios.get(mpesaAuthUrl, {
                "headers": {
                    "Authorization": auth
                }
            })

            const mpesa_access_token = data['access_token'];

            return this.stkPush(mpesa_access_token, phone, amount);

        } catch (e) {
            return [null, e]
        }
    }

    async webHook(request: Request, response: Response, next: NextFunction) {
        const { Body: { stkCallback: { CheckoutRequestID } } } = request.body;
        // verify transaction and do something
        request["io"].emit("mpesa-hook", request.body)
        let message = {
            "ResponseCode": "00000000",
            "ResponseDesc": "success"
        }
        response.json(message);
    }
}
                        
                        
export const MpesaRoutes = [
    createRoute("get", "/MpesaHook", Mpesa, "webHook")
]
                        
const formatPhoneNumber = (phoneNumber: string) => {
    let formatted = parseInt(\`254\${ phoneNumber.substring(1) } \`);
    if (numberIsValid(formatted)) return [formatted, null];
    return [null, true]
}
                        
                        
const numberIsValid = (formatted: any) => {
    let _pattern = /^(?:254|\+254|0)?(7(?:(?:[129][0-9])|(?:0[0-8])|(4[0-1]))[0-9]{6})$/;
    return _pattern.test(formatted);
}
                        
const validateAmount = (amount: number) => {
    if (isNaN(amount) || amount < 1) return [amount, null]
    return [null, true];
}
                        
function getTimestamp() {
    let date = new Date();
    function pad2(n: number) {
        return (n < 10 ? '0' : '') + n;
    }
    return date.getFullYear() +
        pad2(date.getMonth() + 1) +
        pad2(date.getDate()) +
        pad2(date.getHours()) +
        pad2(date.getMinutes()) +
        pad2(date.getSeconds());
}
                        `, () => { })


                        fs.appendFile(`./${project_id}/${name}Project/src/controller/Auth.ts`, `
                        
import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import ${userModel.EntityName} from "../entity/${userModel.EntityName}";
import useTryCatch from "../helpers/useTryCatch";
import { compareSync, hashSync } from "bcrypt";
import { sign } from "jsonwebtoken";
import createRoute from "../helpers/createRoute"
export class AuthController{
    
    private userRepository = getRepository(${userModel.EntityName})
    
async login(req: Request, res: Response, next: NextFunction) {
    const [user, error] = await useTryCatch(
      this.userRepository.findOne({ where: { email: req.body.email } })
    );
    try {
      if (compareSync(req.body.password, user?.password)) {
        const token = sign(user, process.env.APP_SECRET);
        return token;
      }
      else res.status(403)
    } catch (e) {
      res.status(403).send(e)
    }
  }
    
  async register(req: Request, res: Response, next: NextFunction) {
    if (!Boolean(req.body.password) || !Boolean(req.body.email)) {
        res.status(403).json({error:"email and password required"})
      } else {
        req.body["password"] = hashSync(req.body.password, 8);
        const [data, error] = await useTryCatch(this.userRepository.save(req.body))
        if(data) return sign(data, process.env.APP_SECRET)
        else res.status(403).json(error)
      }
  }
}

export const AuthRoutes = [
    createRoute("post", "/Login", AuthController, "login"),
    createRoute("post", "/Register", AuthController, "register")
]
                        
                        `, () => { })
                    })
                }
                fs.mkdir(`./${project_id}/${name}Project/src/${name.toLowerCase()}`, () => {

                    fs.appendFile(`./${project_id}/${name}Project/src/${name.toLowerCase()}/${name.toLowerCase()}.ts`, `
    
import { Request, Response } from "express";
${includeDatabase ? `import { createConnection } from "typeorm";` : ""}
import * as express from "express";
                
export default class ${name}App {
                
static run({ routes, admin, docs, middleware, port }: any): void {
    ${includeDatabase ? `createConnection()
    .then(async(connection) => {`: ""}
         const app = express();
         const http = require("http");
         const server = http.createServer(app)
         const io = require("socket.io")(server, {
            cors: {
              origin: "*",
              methods: ["GET", "POST"],
            },
          });
         middleware.forEach((middleWare: any) => {
             app.use((req, res, next) => middleWare(req, res, next, { server, app, io }))
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
             res.json(" ${name}  Server running on port: " + port);
        });

        server.listen(port);

         console.log("Server has started on port: " + port);
    
         ${includeDatabase ? `})
         .catch((error) => console.log(error));}}`: "}}"}
     
                `, (err) => {

                    })
                })
                fs.mkdir(`./${project_id}/${name}Project/src/middleware`, () => {
                    fs.appendFile(`./${project_id}/${name}Project/src/middleware/Middleware.ts`, `
        import { NextFunction, Request, Response } from "express";
        import * as cors from "cors";
        import * as bodyParser from "body-parser";${includeAuth ? `\nimport * as jwt from "jsonwebtoken";` : ""}\n${includeEmail ? `import * as nodemailer from "nodemailer";` : ""}
    ${includeMpesa ? `
    import Mpesa from "../controller/Mpesa"
    ` : ""}

        export default class MiddleWare {
            
          apply() {
            return [
            bodyParser.json(),
            cors("*" as any),${includeAuth ? `\nthis.verifyTokenMiddleWare,` : ""}\n${includeWebsockets ? `this.socketMiddleWare,` : ""}\n${includeEmail ? `this.emailMiddleWare,` : ""}\n${includeMpesa ? `this.mpesaMiddleWare,` : ""}
            ]
          }${includeAuth ?
                            `\n
    async verifyTokenMiddleWare(request: Request, response: Response, next: NextFunction) {
        const path = request["originalUrl"]
        if(Boolean(path === "/Login") || Boolean(path === "/Register") || Boolean(path==="/")) return next()
        {
            const token =  request.headers["access_token"] as string;
            if (!Boolean(token) || !token.startsWith("JWT")) {
                return response
                  .status(403)
                  .json("A valid access token header is required for this request");
                }
              try {
                const tokenParts= token.split(" ")
                const decoded = jwt.verify(tokenParts[1], process.env.APP_SECRET);
                request["user"] = decoded;
              } catch (err) {
                return response.status(401).send({error:"Invalid token"});
              }
        }
          next()
    }
    `: ""}${includeEmail ?
                            `\n\n
    async emailMiddleWare(request: Request, response: Response, next: NextFunction) {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT),
            auth: {
              user: process.env.EMAIL_ADDRESS,
              pass: process.env.EMAIL_PASSWORD,
            },
          });
          transporter.verify().then(console.log).catch(console.error);
          request["transporter"] = transporter;
          next();
    }
    
    `: ""}${includeWebsockets ?
                            `\n
        async socketMiddleWare(request: Request, response: Response, next: NextFunction, {io}:any) {
                request["io"] = io
              next();
          }
          
          `: ""}


          ${includeMpesa ? `\n
          async mpesaMiddleWare(request: Request, response: Response, next: NextFunction) {
            const mpesa = Mpesa
            request["requestPayment"] = Mpesa.requestPayment
            next();
          }
          ` : ""}
          
            
          async pass(request: Request, response: Response, next: NextFunction) {
            next();
          }
    
    
        }
        `, () => { })
                })

                fs.mkdir(`./${project_id}/${name}Project/src/helpers`, () => {

                    fs.appendFile(`./${project_id}/${name}Project/src/helpers/createRoute.ts`, `
    export default function createRoute(
        m: string,
        r: string,
        c: any,
        a: string,
        p ? : any
    ) {
        return {
            method: m,
            route: r,
            controller: c,
            action: a,
            perimissions: p,
            isAuthenticated: false
        };
    }`, () => { })

                    fs.appendFile(`./${project_id}/${name}Project/src/helpers/registerRoutes.ts`, `
    export default function(routesArray: any[]) {
        return routesArray.reduce((p, c) => p.concat(c), [])
    }`, () => { })

                    fs.appendFile(`./${project_id}/${name}Project/src/helpers/useTryCatch.ts`, `
    export default async function useTryCatch(promise: Promise < any > ) {
        try {
            return [await promise, null];
        } catch (e) {
            return [null, e];
        }
    }
    `, () => { })

                        , () => { }
                })
                fs.mkdir(`./${project_id}/${name}Project/src/migration`, () => { })
                fs.mkdir(`./${project_id}/${name}Project/src/entity`, () => {
                    entities.forEach(({ EntityName, columns }) => {

                        const myRels = relations.filter((f: any) => f.right === EntityName || f.left === EntityName).filter((f: any, i: any, s: any) => s.indexOf(f) === i)
                        function inverseRel({ type, left, right }) {

                            if (EntityName === left) {
                                return type;
                            } else {
                                const dir = ({
                                    OneToOne: "OneToOne",
                                    ManyToOne: "OneToMany",
                                    OneToMany: "ManyToOne",
                                    ManyToMany: "ManyToMany"
                                })
                                return dir[type]
                            }

                        }

                        function inverseType(type: string) {
                            if (type === "OneToMany" || type === "ManyToMany") {
                                return "[]"
                            }
                            return ""
                        }

                        fs.appendFile(`./${project_id}/${name}Project/src/entity/${EntityName}.ts`,
                            `
import { Request, Response, NextFunction } from "express"
import createRoute from "../helpers/createRoute";
import useTryCatch from "../helpers/useTryCatch";
import { PrimaryGeneratedColumn,${createCoordinates(columns, false, true)} ${nearBy(columns, EntityName, true, false)} Entity, Column, getRepository ${myRels.map((p: any) => `,${inverseRel(p)}`).filter((v, i, s) => s.indexOf(v) === i).map(p => p === ",OneToOne" ? ",OneToOne,JoinColumn" : p === ",OneToMany" ? `, OneToMany, JoinTable` : p).join("")}} from "typeorm"
${myRels.map((m: any) => `import ${m.right === EntityName ? `${m.left}` : `${m.right}`} from "./${m.right === EntityName ? `${m.left}` : `${m.right}`}";`).join(``)}
${createCoordinates(columns, false, false)}

@Entity() 
export default class ${EntityName} {

@PrimaryGeneratedColumn("uuid")
id: string
${columns.filter((f: any) => f.type !== "coordinates").map((c: any) => `\n@Column({${c.allowNull ? `nullable: true,` : ""}${c.defaultValue ? `default: "${c.defaultValue}",` : ""}${c.type === "boolean" ? `default:false,` : ""}}) 
${c.key}: ${c.type}`).join("\n")}

${myRels.map((m: any) => `\n@${inverseRel(m)}(() => ${m.right === EntityName ? m.left : m.right}, ${(m.right === EntityName ? m.left : m.right).toLowerCase()} => ${(m.right === EntityName ? m.left : m.right).toLowerCase()}.${(m.right === EntityName ? m.right : m.left).toLowerCase()})${m.type === "OneToOne" && m.left === EntityName ? "\n@JoinColumn()" : ""}${m.type === "OneToMany" && m.left === EntityName ? "\n@JoinTable()" : ""}
${(m.right === EntityName ? m.left : m.right).toLowerCase()}: ${m.right === EntityName ? m.left : m.right}${inverseType(inverseRel(m))}`).join("\n")} 
        
${columns.filter((f: any) => f.type === "coordinates").map((p: any) => {
                                if (p.displayType === "point") {
                                    return `
@Index({ spatial: true })
@Column({
     type: "geometry",
    nullable: ${p.allowNull},
    spatialFeatureType: "Point",
})
geometry: Point
                `
                                } else {
                                    return `
@Index({ spatial: true })
@Column({
    type: "geometry",
    nullable: ${p.allowNull},
})
geometry: string;
                `
                                }
                            })}
    }
        
class ${EntityName}Controller {
    private ${EntityName[0]?.toLowerCase()}R = getRepository(${EntityName});

    async save(req: Request, res: Response, next: NextFunction) {
        ${createCoordinates(columns, true, false)}
        const [data, error] = await useTryCatch(this.${EntityName[0].toLowerCase()}R.save(req.body));
        if (data) return data;
        else res.status(403).json(error);
    }

    async one(req: Request, res: Response, next: NextFunction) {
        const [data, error] = await useTryCatch(this.${EntityName[0].toLowerCase()}R.findOne())
        if (data) return data;
        else res.status(403).json(error);
    }
        
    async all(req: Request, res: Response, next: NextFunction) {
        if (Boolean(req.query.take) && Boolean(req.query.skip)){
        // retrieve all ${EntityName} records with pagination query parms
            const [data, error] = await useTryCatch(this.${EntityName[0].toLowerCase()}R.findAndCount({
                take: req.query.take as unknown as number,
                skip: req.body.skip as unknown as number
            }))
            if (data) return data;
            else res.status(403).json(error);
        } 
        else {
        const [data, error] = await useTryCatch(this.${EntityName[0].toLowerCase()}R.find())
        if (data) return data;
        else res.status(403).json(error)
        }
    }
        
        async update(req: Request, res: Response, next: NextFunction) {
            ${createCoordinates(columns, true, false)}
            const [data, error] = await useTryCatch(this.${EntityName[0].toLowerCase()}R.save(req.body))
            if (data) return data;
            else res.status(403).json(error);
        }
        
        async delete(req: Request, res: Response, next: NextFunction) {
            const [${EntityName.toLowerCase()}, error] = await useTryCatch(this.${EntityName[0].toLowerCase()}R.findOne(req.params.id))
            const [data, err] = await useTryCatch(this.${EntityName[0].toLowerCase()}R.remove(${EntityName.toLowerCase()}))
            if (data) return data;
            else res.status(403).json(error)
        }

        ${nearBy(columns, EntityName, false, false)}
        
        ${relations.filter((r: any) => ((r.left === EntityName) || (r.right === EntityName))).map((c: any) => c.left === EntityName ? c.right : c.left).filter((f: any, i: any, s: any) => s.indexOf(f) === i).map((c: any) => {
                                return (
                                    `
         async ${EntityName.toLowerCase()}by${c}(req:Request, res:Response, next:NextFunction){
             const [data, error] = await useTryCatch(this.${EntityName[0].toLowerCase()}R.find({where:{${c.toLowerCase()}: req.params.id}}))
             if (data) return data;
            else res.status(403).json(error)
         }                           
                                    `
                                )
                            }).join("\n")}
        
        }
        
        
        export const ${EntityName}Routes = [
        createRoute("post", ${'"'}/${EntityName}${'"'}, ${EntityName}Controller, "save"),
        createRoute("get", ${'"'}/${EntityName}${'"'}, ${EntityName}Controller, "all"),
        createRoute("get", ${'"'}/${EntityName}/:id${'"'}, ${EntityName}Controller, "one"),
        createRoute("put", ${'"'}/${EntityName}${'"'}, ${EntityName}Controller, "update"),
        createRoute("delete", ${'"'}/${EntityName}/:id${'"'}, ${EntityName}Controller, "delete"),
        ${nearBy(columns, EntityName, false, true)}
        ${relations.filter((r: any) => ((r.left === EntityName) || (r.right === EntityName))).map((c: any) => c.left === EntityName ? c.right : c.left).filter((f: any, i: any, s: any) => s.indexOf(f) === i).map((c: any) => {
                                return (
                                    `
createRoute("get", ${'"'}/${EntityName}By${c}/:id${'"'}, ${EntityName}Controller, "${EntityName.toLowerCase()}by${c}"),                       
                `
                                )
                            }).join("")}
        
        ]
        `,
                            (err) => {
                                console.log(err || `\n\nCreate file ${EntityName} Model "../entity/${EntityName}.ts"`)
                            })
                    })

                })

                fs.appendFile(`./${project_id}/${name}Project/src/routes.ts`, `

${entities.map((e: any) => `import { ${e.EntityName}Routes } from "./entity/${e.EntityName}";`).join("\n")}
import registerRoutes from "./helpers/registerRoutes";${includeMpesa ? `\nimport { MpesaRoutes } from "./controller/Mpesa"` : ""}${includeAuth ? `\nimport { AuthRoutes } from "./controller/Auth"` : ""}

export const Routes = registerRoutes(
  [${includeAuth ? `\nAuthRoutes,` : ""}${includeMpesa ? `\nMpesaRoutes,` : ""}${entities.map((e: any) => `\n${e.EntityName}Routes`)}
  ]
)
`, data => { })

                // new here
            }
        }

    })
}
