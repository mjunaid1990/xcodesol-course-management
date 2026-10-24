import type { CollectionConfig } from 'payload'

export const Enrollments: CollectionConfig = {
  slug: 'enrollments',
  indexes: [{ fields: ['user', 'course'], unique: true }],
  admin: { useAsTitle: 'course', defaultColumns: ['user', 'course', 'status', 'source', 'createdAt'] },
  access: {
    read: ({ req }) => req.user?.role === 'admin' ? true : req.user ? { user: { equals: req.user.id } } : false,
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'user', type: 'relationship', relationTo: 'users', required: true, index: true },
    { name: 'course', type: 'relationship', relationTo: 'courses', required: true, index: true },
    { name: 'status', type: 'select', required: true, defaultValue: 'active', index: true, options: ['active', 'refunded', 'revoked'] },
    { name: 'source', type: 'select', required: true, defaultValue: 'manual', options: ['manual', 'free', 'stripe'] },
    { name: 'orderReference', type: 'text', index: true },
    { name: 'paymentIntentId', type: 'text', index: true },
    { name: 'enrolledAt', type: 'date', required: true, defaultValue: () => new Date().toISOString() },
  ],
}
