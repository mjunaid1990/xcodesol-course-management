'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function CheckoutButton({ courseID, slug }: { courseID: string; slug: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  async function checkout() {
    setBusy(true)
    setMessage('')
    try {
      const response = await fetch('/api/payments/checkout', { method: 'POST', headers: { 'content-type': 'application/json' }, credentials: 'include', body: JSON.stringify({ courseID }) })
      const data = await response.json()
      if (response.status === 401) {
        router.push(`/login?next=${encodeURIComponent(`/courses/${slug}`)}`)
        return
      }
      if (!response.ok || typeof data.url !== 'string') throw new Error(data.message || 'Checkout could not be started.')
      window.location.assign(data.url)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return <div><button className="button button-primary" type="button" onClick={checkout} disabled={busy}>{busy ? 'Opening checkout…' : 'Enroll now'} <span aria-hidden="true">↗</span></button>{message && <p className="form-error" role="alert">{message}</p>}</div>
}
