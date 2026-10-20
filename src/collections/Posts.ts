import type { CollectionConfig } from 'payload'
import { contentChangeHooks } from '../lib/revalidation'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', '_status', 'publishedAt', 'updatedAt'],
    preview: (doc) => doc?.slug ? `/api/preview?${new URLSearchParams({ collection: 'posts', slug: String(doc.slug), previewSecret: process.env.PREVIEW_SECRET || '' })}` : null,
  },
  hooks: contentChangeHooks('posts'),
  versions: { drafts: { autosave: true, schedulePublish: true }, maxPerDoc: 30 },
  access: {
    read: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor' ? true : { _status: { equals: 'published' } },
    create: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',
    update: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'excerpt', type: 'textarea' },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'author', type: 'relationship', relationTo: 'users' },
    { name: 'categories', type: 'relationship', relationTo: 'categories', hasMany: true },
    { name: 'content', type: 'richText' },
    { name: 'readingTime', type: 'number', min: 1, admin: { description: 'Estimated reading time in minutes.' } },
    { name: 'publishedAt', type: 'date', index: true },
    { name: 'seo', type: 'group', fields: [{ name: 'title', type: 'text' }, { name: 'description', type: 'textarea' }] },
  ],
}
