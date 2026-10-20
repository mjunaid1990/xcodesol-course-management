import type { Block } from 'payload'

export const VideoEmbed: Block = {
  slug: 'videoEmbed',
  labels: { singular: 'Video embed', plural: 'Video embeds' },
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'url', type: 'text', required: true, admin: { description: 'Use a public YouTube or Vimeo embed URL.' } },
    { name: 'caption', type: 'text' },
  ],
}
