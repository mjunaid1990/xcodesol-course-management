import type { Block } from 'payload'

export const Stats: Block = {
  slug: 'stats',
  labels: { singular: 'Stats and logos', plural: 'Stats and logos' },
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'items', type: 'array', minRows: 1, fields: [
      { name: 'value', type: 'text', required: true },
      { name: 'label', type: 'text', required: true },
    ] },
  ],
}
