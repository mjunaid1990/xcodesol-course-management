import React from 'react'
import { ListRowSkeleton } from '@/components/ui/Skeleton'

export default function AdminReviewsLoading() {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-2">
          <div className="h-7 w-64 rounded-lg bg-slate-800/80 animate-pulse" />
          <div className="h-4 w-80 rounded bg-slate-800/40 animate-pulse" />
        </div>
      </div>

      {/* Review items skeleton */}
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-800/80 bg-[#0e1424] p-5 space-y-3 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-slate-800" />
                <div className="space-y-1.5">
                  <div className="h-3.5 w-32 rounded bg-slate-700" />
                  <div className="h-2.5 w-24 rounded bg-slate-800" />
                </div>
              </div>
              <div className="h-7 w-24 rounded-xl bg-slate-800" />
            </div>
            <div className="h-3.5 w-full rounded bg-slate-800/70 ml-12" />
          </div>
        ))}
      </div>
    </div>
  )
}
