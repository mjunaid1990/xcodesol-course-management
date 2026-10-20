import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
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
import { SiteSettings } from './globals/SiteSettings'

export default buildConfig({
  admin: { user: Users.slug },
  collections: [Users, Media, Categories, Courses, Sections, Lessons, Enrollments, LessonProgress, Pages, Posts, Instructors, Testimonials],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: './payload-types.ts' },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
    migrationDir: './src/migrations',
  }),
  onInit: async (payload) => {
    if (!process.env.PAYLOAD_SECRET) payload.logger.warn('PAYLOAD_SECRET is not set. Configure it before deploying.')
  },
})
