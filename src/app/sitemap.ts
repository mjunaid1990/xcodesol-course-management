import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseURL = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '')
  const sitemap: MetadataRoute.Sitemap = [
    { url: baseURL, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseURL}/courses`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseURL}/blog`, changeFrequency: 'weekly', priority: 0.7 },
  ]

  try {
    const payload = await getPayloadClient()
    const [pages, courses, posts] = await Promise.all([
      payload.find({ collection: 'pages', where: { _status: { equals: 'published' } }, limit: 500, depth: 0 }),
      payload.find({ collection: 'courses', where: { _status: { equals: 'published' } }, limit: 500, depth: 0 }),
      payload.find({ collection: 'posts', where: { _status: { equals: 'published' } }, limit: 500, depth: 0 }),
    ])
    sitemap.push(...pages.docs.filter((page) => page.slug !== 'home').map((page) => ({ url: `${baseURL}/${page.slug}`, lastModified: page.updatedAt, changeFrequency: 'monthly' as const, priority: 0.6 })))
    sitemap.push(...courses.docs.map((course) => ({ url: `${baseURL}/courses/${course.slug}`, lastModified: course.updatedAt, changeFrequency: 'monthly' as const, priority: 0.8 })))
    sitemap.push(...posts.docs.map((post) => ({ url: `${baseURL}/blog/${post.slug}`, lastModified: post.updatedAt, changeFrequency: 'monthly' as const, priority: 0.5 })))
  } catch {
    return sitemap
  }

  return sitemap
}
