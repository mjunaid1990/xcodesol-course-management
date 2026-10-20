import { draftMode } from 'next/headers'
import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

const validSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export async function GET(request: Request) {
  const url = new URL(request.url)
  const collection = url.searchParams.get('collection')
  const slug = url.searchParams.get('slug')
  const suppliedSecret = url.searchParams.get('previewSecret')
  const expectedSecret = process.env.PREVIEW_SECRET
  if (!expectedSecret || suppliedSecret !== expectedSecret) return new Response('Preview is not authorized.', { status: 403 })
  if (!slug || !validSlug.test(slug) || !['pages', 'courses', 'posts'].includes(collection || '')) {
    return new Response('Invalid preview target.', { status: 400 })
  }

  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: request.headers })
  if (!user || (user.role !== 'admin' && user.role !== 'editor')) return new Response('Sign in as an editor to preview content.', { status: 403 })

  const path = collection === 'pages' ? slug === 'home' ? '/' : `/${slug}` : collection === 'posts' ? `/blog/${slug}` : `/courses/${slug}`
  const draft = await draftMode()
  await draft.enable()
  return NextResponse.redirect(new URL(path, url.origin))
}
