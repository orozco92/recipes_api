import { MigrationInterface, QueryRunner } from "typeorm";

export class RecipeCategories1724075778742 implements MigrationInterface {
    name = 'RecipeCategories1724075778742'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recipes" ADD "category" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recipes" DROP COLUMN "category"`);
    }

}
