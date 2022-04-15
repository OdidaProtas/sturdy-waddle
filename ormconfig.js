const { dirname } = require("path")

const ext = process.env.FILE_EXTENSION
const app = process.env.APP_FOLDER

module.exports = {
    type: "sqlite",
    // url: process.env.DATABASE,
    database: "db.sqlite",
    logging: false,
    entities: [`${ app }/entity/**/*.${ext}`],
    migrations: [`${ app }/migration/**/*.${ ext }`],
    subscribers: [`$ { app }/subscriber/**/*.${ext}`],
    cli: {
        entitiesDir: `${ app }/entity`,
        migrationsDir: `${ app }/migration`,
        subscribersDir: `${ app }/subscriber`
    },
    ssl: false
        // extra: {
        // ssl: {
        //     rejectUnauthorized: false,
        //   },
        // },
}