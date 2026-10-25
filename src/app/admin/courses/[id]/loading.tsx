import React from 'react'
import { CurriculumSkeleton } from '@/components/ui/Skeleton'

export default function CourseDetailLoading() {
  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-slate-800/60 animate-pulse" />
          <div className="space-y-1.5">
            <div className="h-6 w-72 rounded-lg bg-slate-800/60 animate-pulse" />
            <div className="h-3 w-40 rounded bg-slate-800/40 animate-pulse" />
          </div>
        </div>
        <div className="flex gap-3">
          <div className="h-9 w-28 rounded-xl bg-slate-800/50 animate-pulse" />
          <div className="h-9 w-32 rounded-xl bg-slate-800/60 animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-2xl border border-white/[0.06] bg-[#0c0e17]/80 p-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-3 w-20 rounded bg-slate-800/40 animate-pulse" />
            <div className="h-5 w-24 rounded bg-slate-800/60 animate-pulse" />
          </div>
        ))}
      </div>

      <CurriculumSkeleton />
    </div>
  )
}
