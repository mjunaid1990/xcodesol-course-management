import type { Block } from 'payload'

export const InstructorBio: Block = {
  slug: 'instructorBio',
  labels: { singular: 'Instructor bio', plural: 'Instructor bios' },
  fields: [
    { name: 'instructor', type: 'relationship', relationTo: 'instructors', required: true },
    { name: 'heading', type: 'text' },
  ],
}
