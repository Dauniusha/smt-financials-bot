import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1764715754507 implements MigrationInterface {
  name = 'Initial1764715754507';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'user')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL, "telegram_id" integer NOT NULL, "username" character varying NOT NULL, "locale" character varying NOT NULL, "name" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', CONSTRAINT "UQ_1a1e4649fd31ea6ec6b025c7bfc" UNIQUE ("telegram_id"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."financial_requests_status_enum" AS ENUM('waiting', 'approved', 'canceled', 'rejected')`,
    );
    await queryRunner.query(
      `CREATE TABLE "financial_requests" ("id" SERIAL NOT NULL, "value" integer NOT NULL, "purpose" character varying NOT NULL, "comment" character varying, "user_id" uuid NOT NULL, "status" "public"."financial_requests_status_enum" NOT NULL DEFAULT 'waiting', "date" TIMESTAMP NOT NULL DEFAULT now(), "preferred_payment_method" character varying, "reviewer_id" uuid, "reviewed_at" TIMESTAMP, CONSTRAINT "PK_f7344134c07bca82b99bbd44666" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_requests" ADD CONSTRAINT "FK_bd6d48aab191c94acea8ba3dfd9" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_requests" ADD CONSTRAINT "FK_f9ad6f8b15ddec7bb09fa0b9edc" FOREIGN KEY ("reviewer_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "financial_requests" DROP CONSTRAINT "FK_f9ad6f8b15ddec7bb09fa0b9edc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_requests" DROP CONSTRAINT "FK_bd6d48aab191c94acea8ba3dfd9"`,
    );
    await queryRunner.query(`DROP TABLE "financial_requests"`);
    await queryRunner.query(
      `DROP TYPE "public"."financial_requests_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
  }
}
