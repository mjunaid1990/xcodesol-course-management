import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { useAsTitle: 'alt', defaultColumns: ['alt', 'filename', 'mimeType', 'updatedAt'] },
  upload: { mimeTypes: ['image/*'], imageSizes: [{ name: 'card', width: 800, height: 600, position: 'centre' }, { name: 'thumbnail', width: 400, height: 300, position: 'centre' }] },
  access: { read: () => true, create: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor', update: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor', delete: ({ req: { user } }) => user?.role === 'admin' },
  fields: [
    { name: 'alt', type: 'text', required: true },
    { name: 'tags', type: 'array', fields: [{ name: 'tag', type: 'text' }] },
  ],
}
