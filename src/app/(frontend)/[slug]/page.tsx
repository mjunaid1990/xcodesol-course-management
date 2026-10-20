import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { RenderBlocks } from '@/components/RenderBlocks'
import { PreviewBanner } from '@/components/PreviewBanner'
import { getPayloadClient } from '@/lib/payload'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayloadClient()
  const { isEnabled } = await draftMode()
  const result = await payload.find({ collection: 'pages', where: { slug: { equals: slug }, ...(!isEnabled ? { _status: { equals: 'published' as const } } : {}) }, limit: 1, draft: isEnabled, overrideAccess: isEnabled })
  const page = result.docs[0]
  if (!page) return {}
  const seo = page.seo as { title?: string; description?: string; image?: { url?: string; alt?: string } | string | null } | null
  const image = seo?.image && typeof seo.image === 'object' ? seo.image as { url?: string; alt?: string } : null
  return { title: seo?.title || page.title, description: seo?.description || undefined, openGraph: { title: seo?.title || page.title, description: seo?.description || undefined, images: image?.url ? [{ url: image.url, alt: image.alt || page.title }] : undefined } }
}

export default async function ContentPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const { isEnabled } = await draftMode()
  const result = await payload.find({ collection: 'pages', where: { slug: { equals: slug }, ...(!isEnabled ? { _status: { equals: 'published' as const } } : {}) }, limit: 1, depth: 2, draft: isEnabled, overrideAccess: isEnabled })
  const page = result.docs[0]
  if (!page) notFound()
  return <><PreviewBanner enabled={isEnabled} /><main className="cms-page"><RenderBlocks blocks={(page.layout || []) as never[]} /></main></>
}
