import React from 'react'
import { ListRowSkeleton } from '@/components/ui/Skeleton'

export default function AdminPostsLoading() {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-64 rounded-lg bg-slate-800/80 animate-pulse" />
          <div className="h-4 w-80 rounded bg-slate-800/40 animate-pulse" />
        </div>
        <div className="h-9 w-32 rounded-xl bg-slate-800/60 animate-pulse" />
      </div>

      {/* Posts list skeleton */}
      <ListRowSkeleton count={4} />
    </div>
  )
}
