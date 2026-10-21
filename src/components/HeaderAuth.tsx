'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type UserInfo = {
  id?: string | number
  name?: string | null
  email?: string
  role?: string
}

export function HeaderAuth({ user }: { user: UserInfo | null }) {
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await fetch('/api/users/logout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'include',
      })
      router.refresh()
      router.push('/login')
    } catch {
      window.location.href = '/login'
    } finally {
      setLoggingOut(false)
    }
  }

  if (!user) {
    return (
      <div className="header-user-nav">
        <Link className="header-action" href="/login">
          Sign in <span aria-hidden="true">↗</span>
        </Link>
      </div>
    )
  }

  const isStaff = user.role === 'admin' || user.role === 'editor'
  const displayName = user.name || user.email?.split('@')[0] || 'User'

  return (
    <div className="header-user-nav">
      {isStaff ? (
        <div className="header-staff-links">
          <Link href="/admin" className="header-badge-link admin-tag">
            <span>Studio CMS</span> <span aria-hidden="true">↗</span>
          </Link>
          <Link href="/dashboard" className="header-link">
            Instructor Space
          </Link>
        </div>
      ) : (
        <Link href="/dashboard" className="header-link">
          My Learning
        </Link>
      )}

      <div className="header-user-menu">
        <span className="header-user-pill" title={user.email || ''}>
          {displayName}
        </span>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="header-logout-btn"
          title="Sign out"
        >
          {loggingOut ? '…' : 'Sign out'}
        </button>
      </div>
    </div>
  )
}
