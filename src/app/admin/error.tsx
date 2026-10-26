'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, LayoutDashboard } from 'lucide-react'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Admin Error Caught:', error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-5 shadow-lg shadow-rose-500/10">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <h2 className="font-display text-2xl font-extrabold text-white tracking-tight">
        An error occurred in Admin Studio
      </h2>

      <p className="mt-2 text-sm text-slate-400 max-w-md">
        {error?.message || 'We encountered an unexpected issue while communicating with the database.'}
      </p>

      {error?.digest && (
        <div className="mt-3 font-mono text-[11px] text-slate-500 bg-slate-900/80 px-3 py-1 rounded-lg border border-slate-800">
          Digest: {error.digest}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-brand-600/30 hover:from-brand-500 hover:to-indigo-500 active:scale-95 transition-all cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </button>

        <Link
          href="/admin"
          className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-slate-900/60 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  )
}
