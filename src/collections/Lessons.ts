import type { CollectionConfig, Where } from 'payload'
import { lessonRevalidationHooks } from '../lib/revalidation'

const isStaff = (user?: unknown) => {
  if (!user || typeof user !== 'object' || !('role' in user)) return false
  return user.role === 'admin' || user.role === 'editor'
}
const canEdit: NonNullable<CollectionConfig['access']>['create'] = ({ req }) => isStaff(req.user)

export const Lessons: CollectionConfig = {
  slug: 'lessons',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'section', 'type', 'freePreview', 'order'] },
  hooks: lessonRevalidationHooks,
  access: {
    read: async ({ req }) => {
      if (req.user?.role === 'admin' || req.user?.role === 'editor') return true
      const previewFilter: Where = {
        and: [
          { freePreview: { equals: true } },
          { 'section.course._status': { equals: 'published' } },
        ],
      }
      if (req.user?.role !== 'student') return previewFilter

      const enrollments = await req.payload.find({
        collection: 'enrollments',
        where: { and: [{ user: { equals: req.user.id } }, { status: { equals: 'active' } }] },
        limit: 500,
        depth: 0,
        overrideAccess: true,
      })
      const courseIDs = enrollments.docs.map((enrollment) => typeof enrollment.course === 'object' ? enrollment.course.id : enrollment.course)
      if (!courseIDs.length) return previewFilter
      const courses = await req.payload.find({
        collection: 'courses',
        where: { and: [{ id: { in: courseIDs } }, { _status: { equals: 'published' } }] },
        limit: 500,
        depth: 0,
        overrideAccess: true,
      })
      const publishedCourseIDs = courses.docs.map((course) => course.id)
      if (!publishedCourseIDs.length) return previewFilter
      return {
        or: [
          previewFilter,
          { 'section.course': { in: publishedCourseIDs } },
        ],
      }
    },
    create: canEdit,
    update: canEdit,
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'section', type: 'relationship', relationTo: 'sections', required: true, index: true },
    { name: 'order', type: 'number', required: true, defaultValue: 0, index: true },
    { name: 'type', type: 'select', required: true, defaultValue: 'text', options: ['video', 'text', 'resource', 'quiz'] },
    { name: 'freePreview', type: 'checkbox', defaultValue: false, index: true },
    { name: 'durationMinutes', type: 'number', min: 0 },
    { name: 'videoAssetId', type: 'text', admin: { condition: (_, siblingData) => siblingData.type === 'video', description: 'Mux signed playback ID (not the asset ID). Configure Mux signing credentials in server environment variables.' } },
    { name: 'content', type: 'richText', admin: { condition: (_, siblingData) => siblingData.type === 'text' } },
    { name: 'resources', type: 'array', admin: { condition: (_, siblingData) => siblingData.type === 'resource' }, fields: [
      { name: 'label', type: 'text', required: true },
      { name: 'file', type: 'upload', relationTo: 'course-resources', required: true },
    ] },
  ],
}
