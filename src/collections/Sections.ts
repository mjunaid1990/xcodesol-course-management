import type { CollectionConfig } from 'payload'
import { sectionRevalidationHooks } from '../lib/revalidation'

const isStaff = (user?: unknown) => {
  if (!user || typeof user !== 'object' || !('role' in user)) return false
  return user.role === 'admin' || user.role === 'editor'
}
const canEdit: NonNullable<CollectionConfig['access']>['create'] = ({ req }) => isStaff(req.user)

export const Sections: CollectionConfig = {
  slug: 'sections',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'course', 'order'] },
  hooks: sectionRevalidationHooks,
  access: {
    read: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor' ? true : { 'course._status': { equals: 'published' } },
    create: canEdit,
    update: canEdit,
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'course', type: 'relationship', relationTo: 'courses', required: true, index: true },
    { name: 'order', type: 'number', required: true, defaultValue: 0, index: true },
    { name: 'lessons', type: 'join', collection: 'lessons', on: 'section', defaultSort: 'order' },
  ],
}
