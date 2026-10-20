import type { Block } from 'payload'

export const Testimonials: Block = {
  slug: 'testimonials',
  labels: { singular: 'Testimonial', plural: 'Testimonials' },
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'items', type: 'array', minRows: 1, fields: [
      { name: 'quote', type: 'textarea', required: true },
      { name: 'name', type: 'text', required: true },
      { name: 'detail', type: 'text' },
    ] },
  ],
}
