import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getPayloadClient } from '@/lib/payload'

export const metadata: Metadata = { title: 'Journal | Fieldnotes', description: 'Ideas and notes for curious people.' }

export default async function BlogPage() {
  const payload = await getPayloadClient()
  const result = await payload.find({ collection: 'posts', where: { _status: { equals: 'published' } }, sort: '-publishedAt', limit: 50, depth: 1 })
  return <main className="catalog-page"><p className="eyebrow">THE FIELDNOTES JOURNAL</p><h1>Notes for the<br /><em>curious.</em></h1><p className="catalog-intro">Ideas, lessons, and observations from people who love what they do.</p>{result.docs.length ? <div className="post-grid">{result.docs.map((post) => { const cover = post.coverImage && typeof post.coverImage === 'object' ? post.coverImage as { url?: string; alt?: string } : null; return <article className="post-card" key={post.id}>{cover?.url ? <Link className="post-card-image" href={`/blog/${post.slug}`}><Image src={cover.url} alt={cover.alt || post.title} width={760} height={480} /></Link> : <Link className="post-card-art" href={`/blog/${post.slug}`} aria-label={`Read ${post.title}`}><span>Fieldnotes <i>✳</i></span></Link>}<div className="post-card-body"><div className="post-card-meta"><span className="course-category">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Fieldnotes'}</span>{typeof post.readingTime === 'number' && <span>{post.readingTime} min read</span>}</div><h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>{post.excerpt && <p>{post.excerpt}</p>}<Link className="text-link" href={`/blog/${post.slug}`}>Read article <span aria-hidden="true">↗</span></Link></div></article> })}</div> : <section className="empty-content"><span>✳</span><h2>A fresh page is on its way.</h2><p>Our journal is growing. Come back soon for new ideas and notes.</p><Link className="text-link" href="/courses">Explore courses <span aria-hidden="true">↗</span></Link></section>}</main>
}
