import Link from 'next/link'
import { AuthForm } from '@/components/AuthForm'

export default function SignupPage() {
  return <main className="auth-page"><p className="eyebrow">MAKE ROOM TO GROW</p><h1>Start your<br /><em>next chapter.</em></h1><p className="auth-intro">Create an account to enroll and keep your learning in one place.</p><AuthForm mode="register" /><p className="auth-switch">Already have an account? <Link href="/login">Sign in</Link></p></main>
}
