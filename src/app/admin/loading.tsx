import React from 'react'
import { StatsCardSkeleton, TableSkeleton } from '@/components/ui/Skeleton'

export default function AdminLoading() {
  return (
    <div className="space-y-7 animate-fadeIn">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div className="space-y-2">
          <div className="h-8 w-64 rounded-xl bg-slate-800/50 animate-pulse" />
          <div className="h-4 w-96 rounded-lg bg-slate-800/30 animate-pulse" />
        </div>
        <div className="flex gap-2.5">
          <div className="h-9 w-32 rounded-xl bg-slate-800/50 animate-pulse" />
          <div className="h-9 w-28 rounded-xl bg-slate-800/40 animate-pulse" />
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <StatsCardSkeleton />

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
        <div className="lg:col-span-2 space-y-7">
          <TableSkeleton rows={4} />
          <TableSkeleton rows={4} />
        </div>
        <div>
          <TableSkeleton rows={5} />
        </div>
      </div>
    </div>
  )
}
