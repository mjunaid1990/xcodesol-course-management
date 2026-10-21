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
  },
})
