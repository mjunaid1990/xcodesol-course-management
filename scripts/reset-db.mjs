import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import postgres from 'postgres'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

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
    console.warn(`[Reset DB] Could not read ${filePath}:`, err.message)
  }
}

loadEnvFile(path.join(rootDir, '.env'))
loadEnvFile(path.join(rootDir, '.env.local'))

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  console.log('[Reset DB] ❌ DATABASE_URL is not set.')
  process.exit(1)
}

const needsSsl =
  process.env.NODE_ENV === 'production' ||
  databaseUrl.includes('neon.tech') ||
  databaseUrl.includes('supabase.co') ||
  databaseUrl.includes('vercel-storage.com') ||
  databaseUrl.includes('prisma-postgres') ||
  databaseUrl.includes('pooler.supabase.com')

const sql = postgres(databaseUrl, {
  max: 1,
  ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
})

async function resetDb() {
  console.log('⚠️  Starting complete database table drop and cleanup...')

  try {
    await sql.unsafe(`
      DO $$
      DECLARE
          r RECORD;
      BEGIN
          FOR r IN (
              SELECT tablename 
              FROM pg_tables 
              WHERE schemaname = 'public'
          ) LOOP
              EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
          END LOOP;
      END $$;
    `)

    console.log('✅ All tables successfully dropped in public schema.')
    console.log('Now run "npm run migrate" to apply the clean schema.')
    await sql.end()
    process.exit(0)
  } catch (err) {
    console.error('❌ Reset failed:', err)
    await sql.end({ timeout: 2 }).catch(() => {})
    process.exit(1)
  }
}

resetDb()
