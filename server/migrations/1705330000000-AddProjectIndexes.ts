import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProjectIndexes1705330000000 implements MigrationInterface {
  name = 'AddProjectIndexes1705330000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add index on Project.clientId for better foreign key performance
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_project_clientId" ON "projects" ("clientId")`
    );

    // Add index on Project.consultantId for better foreign key performance
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_project_consultantId" ON "projects" ("consultantId")`
    );

    // Add compound index for common queries filtering by both client and consultant
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_project_client_consultant" ON "projects" ("clientId", "consultantId")`
    );

    // Add index on status for filtering
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_project_status" ON "projects" ("status")`
    );

    // Add index on createdAt for sorting
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_project_createdAt" ON "projects" ("createdAt")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove indexes in reverse order
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_project_createdAt"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_project_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_project_client_consultant"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_project_consultantId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_project_clientId"`);
  }
}
