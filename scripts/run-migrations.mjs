import postgres from 'postgres'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

async function runMigrations() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    console.warn('[migrations] DATABASE_URL is not defined in the environment. Skipping DB migration.')
    return
  }

  console.log('[migrations] Connecting to database to verify/apply schema...')
  const sql = postgres(databaseUrl, {
    max: 1,
    connect_timeout: 15,
    ssl: databaseUrl.includes('supabase') || databaseUrl.includes('sslmode=require') ? 'require' : undefined,
  })

  try {
    // 1. Ensure payload_migrations table exists
    await sql`
      CREATE TABLE IF NOT EXISTS "payload_migrations" (
        "id" serial PRIMARY KEY NOT NULL,
        "name" varchar,
        "batch" numeric,
        "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
        "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
      );
    `

    const migrationName = '20261020_000000_initial_schema'

    // 2. Check if migration already ran
    const existing = await sql`
      SELECT "id" FROM "payload_migrations" WHERE "name" = ${migrationName} LIMIT 1;
    `

    if (existing.length > 0) {
      console.log(`[migrations] Migration "${migrationName}" already applied.`)
      return
    }

    // 3. Apply schema.sql
    const schemaFile = resolve(process.cwd(), 'src/migrations/schema.sql')
    if (!existsSync(schemaFile)) {
      throw new Error(`[migrations] Schema file not found: ${schemaFile}`)
    }

    console.log(`[migrations] Applying database schema from ${schemaFile}...`)
    await sql.file(schemaFile)

    // 4. Record migration in payload_migrations
    await sql`
      INSERT INTO "payload_migrations" ("name", "batch", "updated_at", "created_at")
      VALUES (${migrationName}, 1, now(), now());
    `

    console.log(`[migrations] Migration "${migrationName}" successfully applied and recorded!`)
  } finally {
    await sql.end()
  }
}

runMigrations().catch((err) => {
  console.error('[migrations] Migration failed with error:', err)
  process.exit(1)
})
