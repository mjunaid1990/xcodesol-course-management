import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseURL = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '')
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/dashboard', '/learn', '/login', '/signup'] },
    sitemap: `${baseURL}/sitemap.xml`,
  }
}
