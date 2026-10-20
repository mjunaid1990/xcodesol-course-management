'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  name: z.string().trim().min(2, 'Enter your name.').max(100).optional(),
  email: z.string().trim().email('Enter a valid email address.'),
  password: z.string().min(12, 'Use at least 12 characters.'),
})
type FormValues = z.infer<typeof schema>

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter()
  const [serverError, setServerError] = useState('')
  const [busy, setBusy] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function submit(values: FormValues) {
    setBusy(true)
    setServerError('')
    try {
      if (mode === 'register') {
        const response = await fetch('/api/auth/register', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(values) })
        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message || 'Registration failed.')
        }
      }
      const response = await fetch('/api/users/login', { method: 'POST', headers: { 'content-type': 'application/json' }, credentials: 'include', body: JSON.stringify({ email: values.email, password: values.password }) })
      if (!response.ok) throw new Error(mode === 'register' ? 'Account created. Please sign in.' : 'Email or password was not recognized.')
      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return <form className="auth-form" onSubmit={handleSubmit(submit)} noValidate>
    {mode === 'register' && <label>Your name<input autoComplete="name" {...register('name')} aria-invalid={Boolean(errors.name)} />{errors.name && <span className="form-error">{errors.name.message}</span>}</label>}
    <label>Email address<input type="email" autoComplete="email" {...register('email')} aria-invalid={Boolean(errors.email)} />{errors.email && <span className="form-error">{errors.email.message}</span>}</label>
    <label>Password<input type="password" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} {...register('password')} aria-invalid={Boolean(errors.password)} />{errors.password && <span className="form-error">{errors.password.message}</span>}</label>
    {serverError && <p className="form-error" role="alert">{serverError}</p>}
    <button className="button button-primary" type="submit" disabled={busy}>{busy ? 'Please wait…' : mode === 'register' ? 'Create account' : 'Sign in'} <span aria-hidden="true">↗</span></button>
  </form>
}
