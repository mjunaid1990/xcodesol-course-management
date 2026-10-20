import { existsSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

const directory = resolve(process.cwd(), 'src/migrations')
const hasMigration = existsSync(directory)
  && readdirSync(directory).some((file) => /^\d.*\.(?:ts|js)$/.test(file))

if (!hasMigration) {
  console.error(
    'No Payload database migration was found in src/migrations. Generate the initial schema with `npm run migrate:create`, review and commit the generated migration, then redeploy. Vercel builds apply committed migrations before Next.js builds.',
  )
  process.exit(1)
}
