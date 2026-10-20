import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { PreviewBanner } from '@/components/PreviewBanner'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayloadClient()
  const { isEnabled } = await draftMode()
  const result = await payload.find({ collection: 'posts', where: { slug: { equals: slug }, ...(!isEnabled ? { _status: { equals: 'published' as const } } : {}) }, limit: 1, depth: 1, draft: isEnabled, overrideAccess: isEnabled })
  const post = result.docs[0]
  if (!post) return {}
  const seo = post.seo as { title?: string; description?: string } | null
  const image = post.coverImage && typeof post.coverImage === 'object' ? post.coverImage as { url?: string; alt?: string } : null
  return { title: seo?.title || post.title, description: seo?.description || post.excerpt || undefined, openGraph: { title: seo?.title || post.title, description: seo?.description || post.excerpt || undefined, images: image?.url ? [{ url: image.url, alt: image.alt || post.title }] : undefined } }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const { isEnabled } = await draftMode()
  const result = await payload.find({ collection: 'posts', where: { slug: { equals: slug }, ...(!isEnabled ? { _status: { equals: 'published' as const } } : {}) }, limit: 1, depth: 2, draft: isEnabled, overrideAccess: isEnabled })
  const post = result.docs[0]
  if (!post) notFound()
  const jsonLd = { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.title, description: post.excerpt || undefined, datePublished: post.publishedAt || undefined, dateModified: post.updatedAt, author: { '@type': 'Organization', name: 'Fieldnotes' }, image: post.coverImage && typeof post.coverImage === 'object' ? (post.coverImage as { url?: string }).url : undefined }
  const safeJsonLd = JSON.stringify(jsonLd).replace(/</g, '\\u003c')
  return <><PreviewBanner enabled={isEnabled} /><main className="article-page">{!isEnabled && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd }} />}<p className="eyebrow">THE FIELDNOTES JOURNAL</p><h1>{post.title}</h1>{post.excerpt && <p className="article-excerpt">{post.excerpt}</p>}<div className="article-meta">{post.author && typeof post.author === 'object' ? String(post.author.name || post.author.email) : 'Fieldnotes'}{post.publishedAt && ` · ${new Date(post.publishedAt).toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric' })}`}</div><article className="article-content">{post.content && <RichText data={post.content as never} />}</article></main></>
}
