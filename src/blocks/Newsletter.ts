import type { Block } from 'payload'

export const Newsletter: Block = {
  slug: 'newsletter',
  labels: { singular: 'Newsletter signup', plural: 'Newsletter signups' },
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'body', type: 'textarea' },
    { name: 'buttonLabel', type: 'text', defaultValue: 'Subscribe' },
  ],
}
