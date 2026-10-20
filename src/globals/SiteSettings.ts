import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  hooks: { afterChange: [({ doc }) => { revalidatePath('/', 'layout'); return doc }] },
  access: {
    read: () => true,
    update: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',
  },
  fields: [
    { name: 'siteName', type: 'text', required: true, defaultValue: 'Fieldnotes' },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'favicon', type: 'upload', relationTo: 'media' },
    { name: 'announcement', type: 'group', fields: [{ name: 'enabled', type: 'checkbox', defaultValue: false }, { name: 'text', type: 'text' }, { name: 'link', type: 'text' }] },
    { name: 'navigation', type: 'array', fields: [{ name: 'label', type: 'text', required: true }, { name: 'url', type: 'text', required: true }] },
    { name: 'footerNavigation', type: 'array', fields: [{ name: 'label', type: 'text', required: true }, { name: 'url', type: 'text', required: true }] },
    { name: 'socialLinks', type: 'array', fields: [{ name: 'platform', type: 'text', required: true }, { name: 'url', type: 'text', required: true }] },
    { name: 'seo', type: 'group', fields: [{ name: 'title', type: 'text' }, { name: 'description', type: 'textarea' }, { name: 'openGraphImage', type: 'upload', relationTo: 'media' }] },
    { name: 'brand', type: 'group', fields: [{ name: 'primaryColor', type: 'text', defaultValue: '#465640' }, { name: 'radius', type: 'text', defaultValue: '12px' }] },
  ],
}
