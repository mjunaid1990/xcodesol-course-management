import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { AuthForm } from '@/components/AuthForm'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const query = await searchParams
  const nextTarget =
    (typeof query.next === 'string' ? query.next : '') ||
    (typeof query.redirect === 'string' ? query.redirect : '')

  try {
    const payload = await getPayloadClient()
    const { user } = await payload.auth({ headers: await headers() })
    if (user) {
      if (nextTarget && nextTarget.startsWith('/') && nextTarget !== '/login') {
        redirect(nextTarget)
      }
      redirect(user.role === 'admin' || user.role === 'editor' ? '/admin' : '/dashboard')
    }
  } catch {
    // Continue rendering login form if unauthenticated
  }

  return (
    <main className="auth-page">
      <p className="eyebrow">SIGN IN</p>
      <h1>
        Good to see<br />
        <em>you again.</em>
      </h1>
      <p className="auth-intro">
        Sign in to access your learning courses and management space.
      </p>
      <AuthForm mode="login" />
      <p className="auth-switch">
        New to Fieldnotes? <Link href="/signup">Create an account</Link>
      </p>
    </main>
  )
}
