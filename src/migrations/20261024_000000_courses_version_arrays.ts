import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Payload 3.91 names versioned array tables with the `version_` field prefix.
 * The initial schema used the older table names, so create the names expected
 * by the current adapter while retaining the original tables for rollback/data.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_courses_versions_version_learning_outcomes" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "_courses_versions"("id") ON DELETE CASCADE,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar,
      "item" varchar NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "_courses_versions_version_learning_outcomes_parent_idx"
      ON "_courses_versions_version_learning_outcomes" ("_parent_id");

    CREATE TABLE IF NOT EXISTS "_courses_versions_version_requirements" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "_courses_versions"("id") ON DELETE CASCADE,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar,
      "item" varchar NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "_courses_versions_version_requirements_parent_idx"
      ON "_courses_versions_version_requirements" ("_parent_id");

    CREATE TABLE IF NOT EXISTS "_courses_versions_version_faqs" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "_courses_versions"("id") ON DELETE CASCADE,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar,
      "question" varchar NOT NULL,
      "answer" varchar NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "_courses_versions_version_faqs_parent_idx"
      ON "_courses_versions_version_faqs" ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "_courses_versions_version_faqs" CASCADE;
    DROP TABLE IF EXISTS "_courses_versions_version_requirements" CASCADE;
    DROP TABLE IF EXISTS "_courses_versions_version_learning_outcomes" CASCADE;
  `)
}
