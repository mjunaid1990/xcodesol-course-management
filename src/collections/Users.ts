import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'email', defaultColumns: ['email', 'role', 'createdAt'] },
  access: {
    admin: ({ req: { user } }) => user?.role === 'admin',
    create: ({ req: { user } }) => user?.role === 'admin' || !user,
    delete: ({ req: { user } }) => user?.role === 'admin',
    read: ({ req }) => req.user?.role === 'admin' ? true : req.user ? { id: { equals: req.user.id } } : false,
    update: ({ req }) => req.user?.role === 'admin' ? true : req.user ? { id: { equals: req.user.id } } : false,
  },
  hooks: {
    beforeChange: [({ data, operation, req }) => {
      if (req.user?.role === 'admin' || req.context?.seed) return data

      // Public account creation must retain Payload's auth fields while always
      // assigning the least-privileged role.
      if (operation === 'create') return { ...data, role: 'student' }

      return data
    }],
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'student',
      required: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Student', value: 'student' },
      ],
      access: { update: ({ req: { user } }) => user?.role === 'admin' },
    },
  ],
}
