import type { Block } from 'payload'

export const ImageText: Block = {
  slug: 'imageText',
  labels: { singular: 'Image and text', plural: 'Image and text sections' },
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'body', type: 'textarea', required: true },
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'imageSide', type: 'select', defaultValue: 'left', options: ['left', 'right'] },
  ],
}
