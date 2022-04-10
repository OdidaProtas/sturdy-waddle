import {MigrationInterface, QueryRunner} from "typeorm";

export class ProGenerator1649604341723 implements MigrationInterface {
    name = 'ProGenerator1649604341723'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "projectCount" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
