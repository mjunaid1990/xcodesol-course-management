import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'course', 'featured'] },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',
    update: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    { name: 'quote', type: 'textarea', required: true },
    { name: 'name', type: 'text', required: true },
    { name: 'detail', type: 'text' },
    { name: 'portrait', type: 'upload', relationTo: 'media' },
    { name: 'course', type: 'relationship', relationTo: 'courses' },
    { name: 'featured', type: 'checkbox', defaultValue: false },
  ],
}
