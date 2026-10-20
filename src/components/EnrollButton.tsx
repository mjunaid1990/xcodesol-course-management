'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function EnrollButton({ courseID, slug }: { courseID: string; slug: string }) {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function enroll() {
    setBusy(true)
    setMessage('')
    try {
      const response = await fetch('/api/enrollments/free', { method: 'POST', headers: { 'content-type': 'application/json' }, credentials: 'include', body: JSON.stringify({ courseID }) })
      const data = await response.json()
      if (response.status === 401) {
        router.push(`/login?next=${encodeURIComponent(`/courses/${slug}`)}`)
        return
      }
      if (!response.ok) throw new Error(data.message || 'Enrollment could not be completed.')
      router.push(`/learn/${slug}`)
      router.refresh()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return <div><button className="button button-primary" type="button" onClick={enroll} disabled={busy}>{busy ? 'Enrolling…' : 'Enroll for free'} <span aria-hidden="true">↗</span></button>{message && <p className="form-error" role="alert">{message}</p>}</div>
}
