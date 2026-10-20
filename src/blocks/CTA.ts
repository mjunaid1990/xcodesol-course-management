import type { Block } from 'payload'

export const CTA: Block = {
  slug: 'cta',
  labels: { singular: 'Pricing / call to action', plural: 'Pricing / call to action banners' },
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'body', type: 'textarea' },
    { name: 'buttonLabel', type: 'text', required: true },
    { name: 'buttonLink', type: 'text', required: true },
  ],
}
