import type { CollectionConfig } from 'payload'
import { contentChangeHooks } from '../lib/revalidation'

const isStaff = (user?: unknown) => {
  if (!user || typeof user !== 'object' || !('role' in user)) return false
  return user.role === 'admin' || user.role === 'editor'
}
const canManageContent: NonNullable<CollectionConfig['access']>['create'] = ({ req }) => isStaff(req.user)

export const Courses: CollectionConfig = {
  slug: 'courses',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', '_status', 'category', 'updatedAt'],
    preview: (doc) => doc?.slug ? `/api/preview?${new URLSearchParams({ collection: 'courses', slug: String(doc.slug), previewSecret: process.env.PREVIEW_SECRET || '' })}` : null,
  },
  hooks: contentChangeHooks('courses'),
  versions: { drafts: { autosave: true, schedulePublish: true }, maxPerDoc: 50 },
  access: {
    read: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor' ? true : { _status: { equals: 'published' } },
    create: canManageContent,
    update: canManageContent,
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        placeholder: 'e.g., Complete Fullstack TypeScript Architecture',
        description: 'The primary headline and public title of the course.',
      },
      validate: (value: unknown) => {
        if (typeof value !== 'string' || !value.trim()) return 'Course title is required.'
        if (value.trim().length < 3) return 'Course title must be at least 3 characters.'
        return true
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        placeholder: 'e.g., complete-fullstack-typescript',
        description: 'URL-friendly unique identifier (lowercase letters, numbers, and hyphens).',
      },
      validate: (value: unknown) => {
        if (typeof value !== 'string' || !value.trim()) return 'Course slug is required.'
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
          return 'Slug must contain only lowercase letters, numbers, and hyphens (e.g., fullstack-course).'
        }
        return true
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      admin: {
        placeholder: 'A concise summary outlining key skills, frameworks, and career benefits...',
        description: 'Short introduction displayed on course cards, listings, and social previews.',
      },
      validate: (value: unknown) => {
        if (typeof value !== 'string' || !value.trim()) return 'Course summary is required.'
        if (value.trim().length < 10) return 'Summary must be at least 10 characters.'
        return true
      },
    },
    { name: 'description', type: 'richText' },
    { name: 'sections', type: 'join', collection: 'sections', on: 'course', defaultSort: 'order' },
    { name: 'thumbnail', type: 'upload', relationTo: 'media' },
    { name: 'category', type: 'relationship', relationTo: 'categories', index: true },
    { name: 'instructor', type: 'relationship', relationTo: 'instructors' },
    { name: 'level', type: 'select', options: ['beginner', 'intermediate', 'advanced'], defaultValue: 'beginner' },
    { name: 'language', type: 'text', defaultValue: 'English' },
    {
      name: 'price',
      type: 'number',
      min: 0,
      defaultValue: 0,
      admin: {
        description: 'Course price in currency units. Set to 0 for free access.',
      },
      validate: (value: unknown) => {
        if (value !== undefined && value !== null && value !== '' && Number(value) < 0) {
          return 'Price cannot be negative.'
        }
        return true
      },
    },
    { name: 'currency', type: 'text', defaultValue: 'USD' },
    { name: 'learningOutcomes', type: 'array', fields: [{ name: 'item', type: 'text', required: true }] },
    { name: 'requirements', type: 'array', fields: [{ name: 'item', type: 'text', required: true }] },
    { name: 'faqs', type: 'array', fields: [{ name: 'question', type: 'text', required: true }, { name: 'answer', type: 'textarea', required: true }] },
    { name: 'seo', type: 'group', fields: [{ name: 'title', type: 'text' }, { name: 'description', type: 'textarea' }] },
  ],
}
