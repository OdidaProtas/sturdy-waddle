import {MigrationInterface, QueryRunner} from "typeorm";

export class ProGenerator1650696628326 implements MigrationInterface {
    name = 'ProGenerator1650696628326'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "projectCount" integer NOT NULL DEFAULT (0))`);
        await queryRunner.query(`CREATE TABLE "customers" ("id" varchar PRIMARY KEY NOT NULL, "projectCount" integer NOT NULL DEFAULT (0), "name" varchar)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "customers"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
