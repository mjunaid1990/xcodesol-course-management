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
  throw new Error('Supabase Storage S3 credentials and a private bucket are required for production uploads.')
}

export default buildConfig({
  admin: { user: Users.slug },
  upload: { limits: { fileSize: 4 * 1024 * 1024 } },
  collections: [Users, Media, Categories, Courses, Sections, Lessons, CourseResources, Enrollments, LessonProgress, Reviews, Pages, Posts, Instructors, Testimonials],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: './payload-types.ts' },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
    migrationDir: './src/migrations',
  }),
  plugins: [s3Storage({
    enabled: storageConfigured,
    collections: {
      media: true,
      'course-resources': { signedDownloads: { expiresIn: 15 * 60 } },
    },
    bucket: process.env.SUPABASE_S3_BUCKET || 'course-files-not-configured',
    config: {
      credentials: {
        accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.SUPABASE_S3_SECRET_ACCESS_KEY || '',
      },
      region: process.env.SUPABASE_S3_REGION || 'us-east-1',
      endpoint: process.env.SUPABASE_S3_ENDPOINT,
      forcePathStyle: true,
    },
  })],
  onInit: async (payload) => {
    if (!process.env.PAYLOAD_SECRET) payload.logger.warn('PAYLOAD_SECRET is not set. Configure it before deploying.')
  },
})
