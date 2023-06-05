import { MigrationInterface, QueryRunner } from "typeorm";

export class migrations1685742377568 implements MigrationInterface {
    name = 'migrations1685742377568'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "lastUpdate" date`);
        await queryRunner.query(`ALTER TABLE "user" ADD "refreshToken" character varying`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0377762403047120e804a2b113"`);
        await queryRunner.query(`ALTER TYPE "public"."meal_type_enum" RENAME TO "meal_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."meal_type_enum" AS ENUM('BREAKFAST', 'LUNCH', 'SNACK', 'DINNER')`);
        await queryRunner.query(`ALTER TABLE "meal" ALTER COLUMN "type" TYPE "public"."meal_type_enum" USING "type"::"text"::"public"."meal_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."meal_type_enum_old"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_0377762403047120e804a2b113" ON "meal" ("date", "type", "ownerId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_0377762403047120e804a2b113"`);
        await queryRunner.query(`CREATE TYPE "public"."meal_type_enum_old" AS ENUM('BREAKFAST', 'LUNCH', 'SNACK', 'Dinner')`);
        await queryRunner.query(`ALTER TABLE "meal" ALTER COLUMN "type" TYPE "public"."meal_type_enum_old" USING "type"::"text"::"public"."meal_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."meal_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."meal_type_enum_old" RENAME TO "meal_type_enum"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_0377762403047120e804a2b113" ON "meal" ("date", "type", "ownerId") `);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "refreshToken"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastUpdate"`);
    }

}
