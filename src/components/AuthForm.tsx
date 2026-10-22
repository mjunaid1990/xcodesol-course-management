'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.'),
  password: z.string().min(1, 'Enter your password.'),
})

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name.').max(100).optional(),
  email: z.string().trim().email('Enter a valid email address.'),
  password: z.string().min(8, 'Use at least 8 characters.'),
})

type LoginValues = z.infer<typeof loginSchema>
type RegisterValues = z.infer<typeof registerSchema>
type FormValues = LoginValues & { name?: string }

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter()
  const [serverError, setServerError] = useState('')
  const [busy, setBusy] = useState(false)
  const currentSchema = mode === 'register' ? registerSchema : loginSchema

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(currentSchema),
  })

  function fillAdminCredentials() {
    setValue('email', 'admin@example.com', { shouldValidate: true })
    setValue('password', 'Admin123456!', { shouldValidate: true })
    setServerError('')
  }

  async function submit(values: FormValues) {
    setBusy(true)
    setServerError('')
    const cleanEmail = values.email.trim().toLowerCase()

    try {
      if (mode === 'register') {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ ...values, email: cleanEmail }),
        })
        if (!response.ok) {
          const data = await response.json().catch(() => null)
          throw new Error(data?.message || 'Registration failed.')
        }
      }

      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: cleanEmail, password: values.password }),
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => null)
        const errorMessage =
          errData?.errors?.[0]?.message ||
          errData?.message ||
          (mode === 'register' ? 'Account created. Please sign in.' : 'Email or password was not recognized.')
        throw new Error(errorMessage)
      }

      const { user } = await response.json()
      const searchParams = new URLSearchParams(window.location.search)
      const nextParam = searchParams.get('next') || searchParams.get('redirect')

      const isStaff = user?.role === 'admin' || user?.role === 'editor'
      const target =
        nextParam && nextParam.startsWith('/') && nextParam !== '/login'
          ? nextParam
          : isStaff
            ? '/admin'
            : '/dashboard'

      router.push(target)
      router.refresh()
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit(submit)} noValidate>
      {mode === 'register' && (
        <label>
          Your name
          <input
            autoComplete="name"
            placeholder="Alex Smith"
            {...register('name')}
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name && <span className="form-error">{errors.name.message}</span>}
        </label>
      )}

      <label>
        Email address
        <input
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...register('email')}
          aria-invalid={Boolean(errors.email)}
        />
        {errors.email && <span className="form-error">{errors.email.message}</span>}
      </label>

      <label>
        Password
        <input
          type="password"
          autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
          placeholder="••••••••••••"
          {...register('password')}
          aria-invalid={Boolean(errors.password)}
        />
        {errors.password && <span className="form-error">{errors.password.message}</span>}
      </label>

      {mode === 'login' && (
        <div style={{ margin: '-4px 0 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            onClick={fillAdminCredentials}
            style={{
              background: '#f4f4ee',
              border: '1px solid #dcded2',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '11px',
              color: 'var(--green-dark, #3b4737)',
              cursor: 'pointer',
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>Fill Admin Demo</span>
            <code style={{ fontSize: '10px', background: '#e7e8dc', padding: '2px 5px', borderRadius: '4px' }}>
              admin@example.com
            </code>
          </button>
        </div>
      )}

      {serverError && (
        <p className="form-error" role="alert" style={{ background: '#fdf2f2', border: '1px solid #f8b4b4', padding: '10px 14px', borderRadius: '6px' }}>
          {serverError}
        </p>
      )}

      <button className="button button-primary" type="submit" disabled={busy}>
        {busy ? 'Please wait…' : mode === 'register' ? 'Create account' : 'Sign in'}{' '}
        <span aria-hidden="true">↗</span>
      </button>
    </form>
  )
}
