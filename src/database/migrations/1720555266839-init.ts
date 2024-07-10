import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1720555266839 implements MigrationInterface {
  name = 'Init1720555266839';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "ingredients" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "amount" character varying(255), "unit" character varying(255), "recipe_id" integer, CONSTRAINT "PK_9240185c8a5507251c9f15e0649" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "steps" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "number" integer NOT NULL, "description" text NOT NULL, "recipe_id" integer, CONSTRAINT "PK_65f86ac8996204d11f915f66a5b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "recipes" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "picture" character varying(255), "cooking_time" integer, "servings" integer, "difficulty" character varying(255), "calories" integer, "rating" numeric(2,1) NOT NULL DEFAULT '0', "author_id" integer NOT NULL, CONSTRAINT "PK_8f09680a51bf3669c1598a21682" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "ratings" ("id" SERIAL NOT NULL, "rate" integer NOT NULL, "user_id" integer, "recipe_id" integer, CONSTRAINT "PK_0f31425b073219379545ad68ed9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "username" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "role" character varying(255) NOT NULL DEFAULT 'Customer', "password" character varying(255) NOT NULL, "salt" character varying(255) NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "favorites" ("user_id" integer NOT NULL, "recipe_id" integer NOT NULL, CONSTRAINT "PK_833a2c29bdd2e66eb4edd8e1b10" PRIMARY KEY ("user_id", "recipe_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_35a6b05ee3b624d0de01ee5059" ON "favorites" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f013a5737104974aa8b5716370" ON "favorites" ("recipe_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "ingredients" ADD CONSTRAINT "FK_e099bf7407edb6047abb97c4922" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "steps" ADD CONSTRAINT "FK_e43a042b5e8f92fe17c60c4d599" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "recipes" ADD CONSTRAINT "FK_266ecb7f0041e1327919f36f964" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ratings" ADD CONSTRAINT "FK_f49ef8d0914a14decddbb170f2f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ratings" ADD CONSTRAINT "FK_4bce0c7e813dad6743635afb020" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites" ADD CONSTRAINT "FK_35a6b05ee3b624d0de01ee50593" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites" ADD CONSTRAINT "FK_f013a5737104974aa8b57163708" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "favorites" DROP CONSTRAINT "FK_f013a5737104974aa8b57163708"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites" DROP CONSTRAINT "FK_35a6b05ee3b624d0de01ee50593"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ratings" DROP CONSTRAINT "FK_4bce0c7e813dad6743635afb020"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ratings" DROP CONSTRAINT "FK_f49ef8d0914a14decddbb170f2f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "recipes" DROP CONSTRAINT "FK_266ecb7f0041e1327919f36f964"`,
    );
    await queryRunner.query(
      `ALTER TABLE "steps" DROP CONSTRAINT "FK_e43a042b5e8f92fe17c60c4d599"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ingredients" DROP CONSTRAINT "FK_e099bf7407edb6047abb97c4922"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f013a5737104974aa8b5716370"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_35a6b05ee3b624d0de01ee5059"`,
    );
    await queryRunner.query(`DROP TABLE "favorites"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "ratings"`);
    await queryRunner.query(`DROP TABLE "recipes"`);
    await queryRunner.query(`DROP TABLE "steps"`);
    await queryRunner.query(`DROP TABLE "ingredients"`);
  }
}
