import type { Block } from 'payload'

export const FeaturedCourse: Block = {
  slug: 'featuredCourse',
  labels: { singular: 'Featured course', plural: 'Featured courses' },
  fields: [
    { name: 'course', type: 'relationship', relationTo: 'courses', required: true },
    { name: 'eyebrow', type: 'text' },
  ],
}
