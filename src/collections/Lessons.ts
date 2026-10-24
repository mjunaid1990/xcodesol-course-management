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
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        placeholder: 'e.g., Lesson 1: Setting Up the Development Workspace',
        description: 'Descriptive title for this individual lesson or lecture.',
      },
      validate: (value: unknown) => {
        if (typeof value !== 'string' || !value.trim()) return 'Lesson title is required.'
        if (value.trim().length < 2) return 'Lesson title must be at least 2 characters.'
        return true
      },
    },
    {
      name: 'section',
      type: 'relationship',
      relationTo: 'sections',
      required: true,
      index: true,
      admin: {
        description: 'The parent curriculum section that groups this lesson.',
      },
      validate: (value: unknown) => {
        if (!value) return 'Please select the parent section for this lesson.'
        return true
      },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      index: true,
      admin: {
        description: 'Sequence within this section (0 is first lesson, then 1, 2...).',
      },
      validate: (value: unknown) => {
        if (value === undefined || value === null || value === '') return 'Lesson order number is required.'
        if (Number(value) < 0) return 'Order must be 0 or a positive number.'
        return true
      },
    },
    { name: 'type', type: 'select', required: true, defaultValue: 'text', options: ['video', 'text', 'resource', 'quiz'] },
    { name: 'freePreview', type: 'checkbox', defaultValue: false, index: true },
    {
      name: 'durationMinutes',
      type: 'number',
      min: 0,
      admin: {
        description: 'Estimated lesson completion or video duration in minutes.',
      },
      validate: (value: unknown) => {
        if (value !== undefined && value !== null && value !== '' && Number(value) < 0) {
          return 'Duration cannot be negative.'
        }
        return true
      },
    },
    { name: 'videoAssetId', type: 'text', admin: { condition: (_, siblingData) => siblingData.type === 'video', description: 'Mux signed playback ID (not the asset ID). Configure Mux signing credentials in server environment variables.' } },
    { name: 'content', type: 'richText', admin: { condition: (_, siblingData) => siblingData.type === 'text' } },
    { name: 'resources', type: 'array', admin: { condition: (_, siblingData) => siblingData.type === 'resource' }, fields: [
      { name: 'label', type: 'text', required: true },
      { name: 'file', type: 'upload', relationTo: 'course-resources', required: true },
    ] },
  ],
}
