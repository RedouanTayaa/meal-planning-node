import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMealTable1680551703297 implements MigrationInterface {
  name = 'CreateMealTable1680551703297';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."meal_type_enum" AS ENUM('BREAKFAST', 'LUNCH', 'SNACK', 'Dinner')`,
    );
    await queryRunner.query(
      `CREATE TABLE "meal" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" date NOT NULL, "type" "public"."meal_type_enum" NOT NULL, "menu" text NOT NULL, "ownerId" uuid NOT NULL, CONSTRAINT "PK_ada510a5aba19e6bb500f8f7817" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_0377762403047120e804a2b113" ON "meal" ("date", "type", "ownerId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "meal" ADD CONSTRAINT "FK_ac63b22afd0b1164b3b8883bf45" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "meal" DROP CONSTRAINT "FK_ac63b22afd0b1164b3b8883bf45"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0377762403047120e804a2b113"`,
    );
    await queryRunner.query(`DROP TABLE "meal"`);
    await queryRunner.query(`DROP TYPE "public"."meal_type_enum"`);
  }
}
