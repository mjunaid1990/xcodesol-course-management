import postgres from 'postgres'

const databaseUrl = process.env.DATABASE_URL

declare global {
  // eslint-disable-next-line no-var
  var __postgresSqlClient: postgres.Sql | undefined
}

export function getSqlClient(): postgres.Sql | null {
  if (!databaseUrl) {
    return null
  }

  if (process.env.NODE_ENV === 'production') {
    const needsSsl =
      databaseUrl.includes('neon.tech') ||
      databaseUrl.includes('supabase.co') ||
      databaseUrl.includes('vercel-storage.com') ||
      databaseUrl.includes('pooler.supabase.com')

    return postgres(databaseUrl, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
    })
  }

  if (!global.__postgresSqlClient) {
    const needsSsl =
      databaseUrl.includes('neon.tech') ||
      databaseUrl.includes('supabase.co') ||
      databaseUrl.includes('pooler.supabase.com')

    global.__postgresSqlClient = postgres(databaseUrl, {
      max: 5,
      idle_timeout: 15,
      connect_timeout: 10,
      ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
    })
  }

  return global.__postgresSqlClient
}

export const sql = getSqlClient()
