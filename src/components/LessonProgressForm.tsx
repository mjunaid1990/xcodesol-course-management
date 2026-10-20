'use client'

import { useState } from 'react'

export function LessonProgressForm({ lessonID, initialCompleted = false, initialNotes = '' }: { lessonID: string; initialCompleted?: boolean; initialNotes?: string }) {
  const [completed, setCompleted] = useState(initialCompleted)
  const [notes, setNotes] = useState(initialNotes)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function save() {
    setBusy(true)
    setMessage('')
    try {
      const response = await fetch('/api/progress', { method: 'POST', headers: { 'content-type': 'application/json' }, credentials: 'include', body: JSON.stringify({ lessonID, completed, notes }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Progress could not be saved.')
      setMessage('Saved')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return <section className="lesson-tools"><label className="completed-toggle"><input type="checkbox" checked={completed} onChange={(event) => setCompleted(event.target.checked)} /> Mark lesson complete</label><label className="notes-label">Your notes<textarea value={notes} maxLength={5000} onChange={(event) => setNotes(event.target.value)} rows={5} placeholder="Keep a note for next time…" /></label><div className="lesson-save-row"><button className="button button-primary" type="button" onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save progress'}</button>{message && <span aria-live="polite">{message}</span>}</div></section>
}
