import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import { s3Storage } from '@payloadcms/storage-s3'
import { Categories } from './collections/Categories'
import { Courses } from './collections/Courses'
import { Lessons } from './collections/Lessons'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Sections } from './collections/Sections'
import { Instructors } from './collections/Instructors'
import { Enrollments } from './collections/Enrollments'
import { LessonProgress } from './collections/LessonProgress'
import { Testimonials } from './collections/Testimonials'
import { Users } from './collections/Users'
import { Reviews } from './collections/Reviews'
import { CourseResources } from './collections/CourseResources'
import { SiteSettings } from './globals/SiteSettings'

const storageConfigured = Boolean(
  process.env.SUPABASE_S3_BUCKET &&
  process.env.SUPABASE_S3_ACCESS_KEY_ID &&
  process.env.SUPABASE_S3_SECRET_ACCESS_KEY &&
  process.env.SUPABASE_S3_ENDPOINT &&
  process.env.SUPABASE_S3_REGION,
)

if (process.env.VERCEL && !storageConfigured) {
  console.warn('Supabase Storage S3 credentials not configured; file uploads will be disabled.')
}

export default buildConfig({
  admin: {
    user: Users.slug,
    routes: {
      login: '/login',
    },
    meta: {
      titleSuffix: '— Fieldnotes Studio',
    },
    components: {
      graphics: {
        Logo: '@/components/admin/AdminLogo#AdminLogo',
        Icon: '@/components/admin/AdminIcon#AdminIcon',
      },
      beforeDashboard: [
        '@/components/admin/DashboardOverview#DashboardOverview',
      ],
    },
  },
  upload: { limits: { fileSize: 4 * 1024 * 1024 } },
  collections: [Users, Media, Categories, Courses, Sections, Lessons, CourseResources, Enrollments, LessonProgress, Reviews, Pages, Posts, Instructors, Testimonials],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'course-platform-secure-jwt-payload-secret-key-32chars',
  typescript: { outputFile: './payload-types.ts' },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
    migrationDir: './src/migrations',
  }),
  plugins: storageConfigured ? [s3Storage({
    enabled: true,
    collections: {
      media: true,
      'course-resources': { signedDownloads: { expiresIn: 15 * 60 } },
    },
    bucket: process.env.SUPABASE_S3_BUCKET || '',
    config: {
      credentials: {
        accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.SUPABASE_S3_SECRET_ACCESS_KEY || '',
      },
      region: process.env.SUPABASE_S3_REGION || 'us-east-1',
      endpoint: process.env.SUPABASE_S3_ENDPOINT,
      forcePathStyle: true,
    },
  })] : [],
  onInit: async (payload) => {
    if (!process.env.PAYLOAD_SECRET) payload.logger.warn('PAYLOAD_SECRET is using fallback. Configure it in Vercel environment variables.')

    try {
      const adminEmail = (process.env.SEED_ADMIN_EMAIL || 'admin@example.com').toLowerCase().trim()
      const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin123456!'

      const existingUsers = await payload.find({
        collection: 'users',
        where: { email: { equals: adminEmail } },
        showHiddenFields: true,
        overrideAccess: true,
        limit: 1,
      })

      if (existingUsers.docs.length === 0) {
        await payload.create({
          collection: 'users',
          data: {
            name: 'Course Administrator',
            email: adminEmail,
            password: adminPassword,
            role: 'admin',
          },
          overrideAccess: true,
        })
        payload.logger.info(`[auth] Initialized admin account (${adminEmail})`)
      } else {
        const adminDoc = existingUsers.docs[0] as any
        const isCorruptedHash = !adminDoc.hash || (typeof adminDoc.hash === 'string' && adminDoc.hash.includes(':600000:32:')) || !adminDoc.salt
        const isLocked = Boolean(adminDoc.lockUntil) || Boolean(adminDoc.loginAttempts && adminDoc.loginAttempts > 0)

        if (isCorruptedHash || isLocked) {
          await payload.update({
            collection: 'users',
            id: adminDoc.id,
            data: {
              password: adminPassword,
              role: 'admin',
              loginAttempts: 0,
              lockUntil: null,
            },
            overrideAccess: true,
          })
          payload.logger.info(`[auth] Auto-healed credentials & unlocked admin account (${adminEmail})`)
        }
      }
    } catch (e: any) {
      payload.logger.warn(`[auth] onInit admin sync: ${e?.message || e}`)
    }
  },
})
