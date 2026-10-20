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
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'summary', type: 'textarea', required: true },
    { name: 'description', type: 'richText' },
    { name: 'sections', type: 'join', collection: 'sections', on: 'course', defaultSort: 'order' },
    { name: 'thumbnail', type: 'upload', relationTo: 'media' },
    { name: 'category', type: 'relationship', relationTo: 'categories', index: true },
    { name: 'instructor', type: 'relationship', relationTo: 'instructors' },
    { name: 'level', type: 'select', options: ['beginner', 'intermediate', 'advanced'], defaultValue: 'beginner' },
    { name: 'language', type: 'text', defaultValue: 'English' },
    { name: 'price', type: 'number', min: 0, defaultValue: 0 },
    { name: 'currency', type: 'text', defaultValue: 'USD' },
    { name: 'learningOutcomes', type: 'array', fields: [{ name: 'item', type: 'text', required: true }] },
    { name: 'requirements', type: 'array', fields: [{ name: 'item', type: 'text', required: true }] },
    { name: 'faqs', type: 'array', fields: [{ name: 'question', type: 'text', required: true }, { name: 'answer', type: 'textarea', required: true }] },
    { name: 'seo', type: 'group', fields: [{ name: 'title', type: 'text' }, { name: 'description', type: 'textarea' }] },
  ],
}
