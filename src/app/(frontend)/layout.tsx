import type { Metadata } from 'next'
import { DM_Sans, DM_Serif_Display } from 'next/font/google'
import '../globals.css'
import '../content.css'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })
const dmSerif = DM_Serif_Display({ subsets: ['latin'], weight: '400', variable: '--font-dm-serif' })

export async function generateMetadata(): Promise<Metadata> {
  try {
    const payload = await getPayloadClient()
    const settings = await payload.findGlobal({ slug: 'site-settings' }) as unknown as { seo?: unknown; siteName?: string; navigation?: unknown; announcement?: unknown }
    const seo = settings.seo as { title?: string; description?: string; openGraphImage?: { url?: string } | string } | undefined
    const image = seo?.openGraphImage && typeof seo.openGraphImage === 'object' ? seo.openGraphImage.url : undefined
    return {
      metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
      title: { default: seo?.title || settings.siteName || 'Fieldnotes', template: `%s | ${settings.siteName || 'Fieldnotes'}` },
      description: seo?.description || 'Practical courses for people who love to keep learning.',
      openGraph: { title: seo?.title || settings.siteName || 'Fieldnotes', description: seo?.description || undefined, images: image ? [image] : undefined },
    }
  } catch {
    return { metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'), title: { default: 'Fieldnotes — Learn with clarity', template: '%s | Fieldnotes' }, description: 'Practical courses for people who love to keep learning.' }
  }
}

export default async function FrontendLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  let menu: Array<{ label: string; url: string }> = [
    { label: 'Courses', url: '/courses' },
    { label: 'About', url: '/about' },
    { label: 'Journal', url: '/blog' },
  ]
  let announcement: { enabled?: boolean; text?: string; link?: string } | null = null
  try {
    const payload = await getPayloadClient()
    const settings = await payload.findGlobal({ slug: 'site-settings' }) as unknown as { seo?: unknown; siteName?: string; navigation?: unknown; announcement?: unknown }
    if (Array.isArray(settings.navigation) && settings.navigation.length) {
      menu = settings.navigation as Array<{ label: string; url: string }>
    }
    announcement = settings.announcement as { enabled?: boolean; text?: string; link?: string } | null
  } catch {
    menu = [
      { label: 'Courses', url: '/courses' },
      { label: 'About', url: '/about' },
      { label: 'Journal', url: '/blog' },
    ]
  }
  return (
    <div className={`font-theme ${dmSans.variable} ${dmSerif.variable}`}>
      {announcement?.enabled && announcement.text && <div className="announcement-bar">{announcement.link ? <a href={announcement.link}>{announcement.text} ↗</a> : announcement.text}</div>}
      <header className="site-header">
        <a className="brand" href="/" aria-label="Fieldnotes home"><span className="brand-mark">F</span> fieldnotes</a>
        <nav className="site-navigation" aria-label="Main navigation">
          {menu.map((item) => <a href={item.url} key={`${item.label}-${item.url}`}>{item.label}</a>)}
        </nav>
        <a className="header-action" href="/login">Student sign in <span aria-hidden="true">↗</span></a>
      </header>
      {children}
      <footer className="site-footer"><a className="brand" href="/">fieldnotes</a><span>Thoughtful learning, for the long run.</span><span>© 2025 Fieldnotes</span></footer>
    </div>
  )
}
