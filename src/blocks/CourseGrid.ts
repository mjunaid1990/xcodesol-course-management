import type { Block } from 'payload'

export const CourseGrid: Block = {
  slug: 'courseGrid',
  labels: { singular: 'Course grid', plural: 'Course grids' },
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'intro', type: 'textarea' },
    { name: 'courses', type: 'relationship', relationTo: 'courses', hasMany: true },
    { name: 'limit', type: 'number', min: 1, max: 12, defaultValue: 3 },
  ],
}
