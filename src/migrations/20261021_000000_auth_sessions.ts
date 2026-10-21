import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "reset_password_requested_at" timestamp(3) with time zone;

    CREATE TABLE IF NOT EXISTS "users_sessions" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
      "id" varchar PRIMARY KEY NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now(),
      "expires_at" timestamp(3) with time zone NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "users_sessions_parent_idx" ON "users_sessions" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "users_sessions_order_idx" ON "users_sessions" ("_order");

    CREATE TABLE IF NOT EXISTS "payload_kv" (
      "id" serial PRIMARY KEY NOT NULL,
      "key" varchar NOT NULL,
      "data" jsonb NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "payload_kv_key_idx" ON "payload_kv" ("key");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "payload_kv" CASCADE;
    DROP TABLE IF EXISTS "users_sessions" CASCADE;
    ALTER TABLE "users" DROP COLUMN IF EXISTS "reset_password_requested_at";
  `)
}
