import Link from 'next/link'
import { AuthForm } from '@/components/AuthForm'

export default function LoginPage() {
  return <main className="auth-page"><p className="eyebrow">WELCOME BACK</p><h1>Good to see<br /><em>you again.</em></h1><p className="auth-intro">Sign in to pick up where you left off.</p><AuthForm mode="login" /><p className="auth-switch">New to Fieldnotes? <Link href="/signup">Create an account</Link></p></main>
}
