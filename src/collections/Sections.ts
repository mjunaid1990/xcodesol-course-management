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
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        placeholder: 'e.g., Module 1: Core Fundamentals & Principles',
        description: 'Provide a clear, descriptive title for this curriculum section.',
      },
      validate: (value: unknown) => {
        if (typeof value !== 'string' || !value.trim()) {
          return 'Section title is required.'
        }
        if (value.trim().length < 2) {
          return 'Section title must be at least 2 characters.'
        }
        if (value.trim().length > 150) {
          return 'Section title cannot exceed 150 characters.'
        }
        return true
      },
    },
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
      index: true,
      admin: {
        description: 'Choose the published or draft course that this section belongs to.',
      },
      validate: (value: unknown) => {
        if (!value) {
          return 'Please select a parent course for this section.'
        }
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
        description: 'Display order sequence in syllabus (0 appears first, then 1, 2, etc.).',
      },
      validate: (value: unknown) => {
        if (value === undefined || value === null || value === '') {
          return 'Section order number is required.'
        }
        const num = Number(value)
        if (isNaN(num) || num < 0) {
          return 'Order must be 0 or a positive number.'
        }
        return true
      },
    },
    {
      name: 'lessons',
      type: 'join',
      collection: 'lessons',
      on: 'section',
      defaultSort: 'order',
      admin: {
        description: 'Lessons linked to this section. You can create lessons directly or manage their order.',
      },
    },
  ],
}
