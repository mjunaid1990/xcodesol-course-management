import type { Block } from 'payload'

export const ContactForm: Block = {
  slug: 'contactForm',
  labels: { singular: 'Contact form', plural: 'Contact forms' },
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'intro', type: 'textarea' },
    { name: 'recipientEmail', type: 'email', admin: { description: 'Form submissions will be sent here once email delivery is configured.' } },
  ],
}
