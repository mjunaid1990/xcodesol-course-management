import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import config from '@payload-config'
import { importMap } from '../importMap'

import { redirect } from 'next/navigation'

type Args = { params: Promise<{ segments: string[] }>; searchParams: Promise<{ [key: string]: string | string[] }> }

export const generateMetadata = ({ params, searchParams }: Args) =>
  generatePageMetadata({ config, params, searchParams })

export default async function Page({ params, searchParams }: Args) {
  const resolvedParams = await params
  const segments = resolvedParams?.segments || []

  // Ensure there is only one login: redirect any admin login view directly to /login
  if (segments[0] === 'login') {
    const resolvedSearchParams = await searchParams
    const rawTarget =
      (typeof resolvedSearchParams?.redirect === 'string' ? resolvedSearchParams.redirect : '') ||
      (typeof resolvedSearchParams?.next === 'string' ? resolvedSearchParams.next : '') ||
      '/admin'
    const target = rawTarget.startsWith('/') ? rawTarget : '/admin'
    redirect(`/login?next=${encodeURIComponent(target)}`)
  }

  return RootPage({ config, params, searchParams, importMap })
}
