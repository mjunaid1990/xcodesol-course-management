import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import postgres from 'postgres'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

// Simple .env parser to support local execution without external dotenv dependency
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIdx = trimmed.indexOf('=')
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim()
        let val = trimmed.slice(eqIdx + 1).trim()
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1)
        }
        if (!process.env[key]) {
          process.env[key] = val
        }
      }
    }
  } catch (err) {
    console.warn(`[Migrations] Could not read ${filePath}:`, err.message)
  }
}

// Load .env and .env.local if present
loadEnvFile(path.join(rootDir, '.env'))
loadEnvFile(path.join(rootDir, '.env.local'))

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  console.log('----------------------------------------------------')
  console.log('[Migration Runner] ℹ️  DATABASE_URL is not set.')
  console.log('[Migration Runner] Skipping migration execution.')
  console.log('----------------------------------------------------')
  process.exit(0)
}

console.log('----------------------------------------------------')
console.log('[Migration Runner] 🚀 Starting PostgreSQL migrations...')
console.log('----------------------------------------------------')

const needsSsl =
  process.env.NODE_ENV === 'production' ||
  databaseUrl.includes('neon.tech') ||
  databaseUrl.includes('supabase.co') ||
  databaseUrl.includes('vercel-storage.com') ||
  databaseUrl.includes('pooler.supabase.com')

const sql = postgres(databaseUrl, {
  max: 1,
  ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
  connect_timeout: 15,
})

async function runMigrations() {
  try {
    // 0. CLEAN RESET: Completely wipe any legacy Payload and outdated tables
    console.log('[Migration Runner] 🧹 Cleaning up any legacy/old tables...')
    await sql.unsafe(`
      DROP TABLE IF EXISTS payload_preferences_rels CASCADE;
      DROP TABLE IF EXISTS payload_preferences CASCADE;
      DROP TABLE IF EXISTS payload_migrations CASCADE;
      DROP TABLE IF EXISTS payload_locked_documents_rels CASCADE;
      DROP TABLE IF EXISTS payload_locked_documents CASCADE;

      DROP TABLE IF EXISTS course_resources CASCADE;
      DROP TABLE IF EXISTS lesson_progress CASCADE;
      DROP TABLE IF EXISTS reviews CASCADE;
      DROP TABLE IF EXISTS enrollments CASCADE;
      DROP TABLE IF EXISTS orders CASCADE;
      DROP TABLE IF EXISTS coupons CASCADE;
      DROP TABLE IF EXISTS lessons CASCADE;
      DROP TABLE IF EXISTS sections CASCADE;
      DROP TABLE IF EXISTS courses CASCADE;
      DROP TABLE IF EXISTS categories CASCADE;
      DROP TABLE IF EXISTS pages CASCADE;
      DROP TABLE IF EXISTS posts CASCADE;
      DROP TABLE IF EXISTS testimonials CASCADE;
      DROP TABLE IF EXISTS media CASCADE;
      DROP TABLE IF EXISTS site_settings CASCADE;
      DROP TABLE IF EXISTS instructors CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
      DROP TABLE IF EXISTS _migrations CASCADE;
    `)
    console.log('[Migration Runner] ✅ Old tables removed cleanly.')

    // 1. Ensure migrations table exists
    await sql`
      CREATE TABLE IF NOT EXISTS _migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `

    // 2. Scan migrations directory
    const migrationsDir = path.join(rootDir, 'src', 'lib', 'db', 'migrations')
    if (!fs.existsSync(migrationsDir)) {
      console.log(`[Migration Runner] Directory ${migrationsDir} not found.`)
      await sql.end()
      process.exit(0)
    }

    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort()

    let newlyAppliedCount = 0

    for (const file of files) {
      console.log(`  ⚡ Applying clean schema migration: ${file}...`)
      const filePath = path.join(migrationsDir, file)
      const migrationSql = fs.readFileSync(filePath, 'utf-8')

      // Run migration inside transaction
      await sql.begin(async (tx) => {
        await tx.unsafe(migrationSql)
        await tx`INSERT INTO _migrations (name) VALUES (${file});`
      })

      console.log(`  ✅ Successfully applied clean schema: ${file}`)
      newlyAppliedCount++
    }

    console.log('----------------------------------------------------')
    console.log(`[Migration Runner] 🎉 Applied ${newlyAppliedCount} clean migration(s) successfully.`)
    console.log('----------------------------------------------------')

    await sql.end()
    process.exit(0)
  } catch (err) {
    console.error('[Migration Runner] ❌ Migration failed:', err)
    await sql.end({ timeout: 2 }).catch(() => {})
    process.exit(1)
  }
}

runMigrations()
