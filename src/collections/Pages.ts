import type { CollectionConfig } from 'payload'
import { contentChangeHooks } from '../lib/revalidation'
import { CTA } from '../blocks/CTA'
import { ContactForm } from '../blocks/ContactForm'
import { CourseGrid } from '../blocks/CourseGrid'
import { FeaturedCourse } from '../blocks/FeaturedCourse'
import { FAQ } from '../blocks/FAQ'
import { Hero } from '../blocks/Hero'
import { ImageText } from '../blocks/ImageText'
import { InstructorBio } from '../blocks/InstructorBio'
import { Newsletter } from '../blocks/Newsletter'
import { RichTextBlock } from '../blocks/RichTextBlock'
import { Stats } from '../blocks/Stats'
import { Testimonials } from '../blocks/Testimonials'
import { VideoEmbed } from '../blocks/VideoEmbed'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    preview: (doc) => doc?.slug ? `/api/preview?${new URLSearchParams({ collection: 'pages', slug: String(doc.slug), previewSecret: process.env.PREVIEW_SECRET || '' })}` : null,
  },
  hooks: contentChangeHooks('pages'),
  versions: { drafts: { autosave: true, schedulePublish: true }, maxPerDoc: 50 },
  access: {
    read: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor' ? true : { _status: { equals: 'published' } },
    create: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',
    update: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'layout', type: 'blocks', required: true, blocks: [Hero, CourseGrid, FeaturedCourse, RichTextBlock, ImageText, Testimonials, FAQ, CTA, InstructorBio, Stats, Newsletter, VideoEmbed, ContactForm] },
    { name: 'seo', type: 'group', fields: [{ name: 'title', type: 'text' }, { name: 'description', type: 'textarea' }, { name: 'image', type: 'upload', relationTo: 'media' }] },
  ],
}
