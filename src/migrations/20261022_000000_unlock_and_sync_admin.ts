import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import crypto from 'node:crypto'

function generatePayloadHash(password: string) {
  const salt = crypto.randomBytes(32).toString('hex')
  const iterations = 600000
  const keyLength = 32
  const hashBuffer = crypto.pbkdf2Sync(password, salt, iterations, keyLength, 'sha256')
  const hash = `pbkdf2-sha256-v1:${hashBuffer.toString('hex')}`
  return { salt, hash }
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  const adminEmail = (process.env.SEED_ADMIN_EMAIL || 'admin@example.com').toLowerCase().trim()
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin123456!'
  const editorEmail = (process.env.SEED_EDITOR_EMAIL || 'editor@example.com').toLowerCase().trim()
  const editorPassword = process.env.SEED_EDITOR_PASSWORD || 'Editor123456!'

  const adminAuth = generatePayloadHash(adminPassword)
  const editorAuth = generatePayloadHash(editorPassword)

  // 1. Reset locks and sync valid PBKDF2 hash for admin and editor
  await db.execute(sql`
    INSERT INTO "users" ("name", "email", "role", "salt", "hash", "login_attempts", "lock_until", "updated_at", "created_at")
    VALUES 
      ('Course Administrator', ${adminEmail}, 'admin', ${adminAuth.salt}, ${adminAuth.hash}, 0, NULL, now(), now()),
      ('Course Editor', ${editorEmail}, 'editor', ${editorAuth.salt}, ${editorAuth.hash}, 0, NULL, now(), now())
    ON CONFLICT ("email") DO UPDATE SET
      "role" = EXCLUDED."role",
      "login_attempts" = 0,
      "lock_until" = NULL,
      "updated_at" = now();

    UPDATE "users" 
    SET "login_attempts" = 0, "lock_until" = NULL
    WHERE "role" IN ('admin', 'editor') OR "email" IN (${adminEmail}, ${editorEmail});
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // No-op for unlock rollback
}
