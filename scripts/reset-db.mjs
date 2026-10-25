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
  databaseUrl.includes('pooler.supabase.com')

const sql = postgres(databaseUrl, {
  max: 1,
  ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
})

async function resetDb() {
  console.log('⚠️  Starting complete database table drop and cleanup...')

  try {
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

    console.log('✅ All old tables successfully dropped.')
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
