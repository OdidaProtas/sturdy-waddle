
    const environment = process.env.ENVIRONMENT;
    const ext = environment === "debug" ? "ts" : "js";
    const app = environment === "debug" ? "src" : "build";
    
    module.exports = {
        type: "postgres",
        port: 5432,
        url: process.env.DATABASE,
        logging: false,
        entities: [`${ app }/entity/**/*.${ext}`],
        migrations: [`${ app }/migration/**/*.${ ext }`],
        subscribers: [`$ { app }/subscriber/**/*.${ext}`],
        cli: { entitiesDir:`${ app }/entity`,
        migrationsDir: `${ app }/migration`,
        subscribersDir: `${ app }/subscriber`},
        ssl: false
        // extra: {
        // ssl: {
        //     rejectUnauthorized: false,
         //   },
        // },
         }
                