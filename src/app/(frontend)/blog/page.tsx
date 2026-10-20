import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'

export const metadata: Metadata = { title: 'Journal | Fieldnotes', description: 'Ideas and notes for curious people.' }

export default async function BlogPage() {
  const payload = await getPayloadClient()
  const result = await payload.find({ collection: 'posts', where: { _status: { equals: 'published' } }, sort: '-publishedAt', limit: 50, depth: 1 })
  return <main className="catalog-page"><p className="eyebrow">THE FIELDNOTES JOURNAL</p><h1>Notes for the<br /><em>curious.</em></h1><p className="catalog-intro">Ideas, lessons, and observations from people who love what they do.</p><div className="post-grid">{result.docs.map((post) => <article className="post-card" key={post.id}><span className="course-category">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Fieldnotes'}</span><h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2><p>{post.excerpt}</p><Link className="text-link" href={`/blog/${post.slug}`}>Read article →</Link></article>)}</div></main>
}
