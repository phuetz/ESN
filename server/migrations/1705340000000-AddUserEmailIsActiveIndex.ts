import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserEmailIsActiveIndex1705340000000 implements MigrationInterface {
  name = 'AddUserEmailIsActiveIndex1705340000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add composite index on email and isActive for optimized login queries
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_user_email_isActive" ON "users" ("email", "isActive")`
    );

    // Add single index on email if it doesn't exist
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_user_email" ON "users" ("email")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove the indexes
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_user_email_isActive"`
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_user_email"`
    );
  }
}
