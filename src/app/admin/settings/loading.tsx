import React from 'react'

export default function AdminSettingsLoading() {
  return (
    <div className="space-y-8 max-w-4xl pb-16 animate-fadeIn">
      {/* Header skeleton */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="space-y-2">
          <div className="h-7 w-56 rounded-lg bg-slate-800/80 animate-pulse" />
          <div className="h-4 w-96 rounded bg-slate-800/40 animate-pulse" />
        </div>
        <div className="h-9 w-32 rounded-xl bg-slate-800/60 animate-pulse" />
      </div>

      {/* 3 Settings card skeletons */}
      {[1, 2, 3].map((idx) => (
        <div
          key={idx}
          className="rounded-2xl border border-slate-800 bg-[#0e1424] p-6 space-y-4 animate-pulse"
        >
          <div className="h-4 w-40 rounded bg-slate-700" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-10 rounded-xl bg-slate-800/80" />
            <div className="h-10 rounded-xl bg-slate-800/80" />
          </div>
          <div className="h-10 rounded-xl bg-slate-800/80" />
        </div>
      ))}
    </div>
  )
}
