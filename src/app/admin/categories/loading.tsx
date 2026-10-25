import React from 'react'
import { ListRowSkeleton } from '@/components/ui/Skeleton'

export default function CategoriesLoading() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-56 rounded-xl bg-slate-800/50 animate-pulse" />
          <div className="h-4 w-80 rounded-lg bg-slate-800/30 animate-pulse" />
        </div>
        <div className="h-9 w-32 rounded-xl bg-slate-800/50 animate-pulse" />
      </div>

      <ListRowSkeleton count={4} />
    </div>
  )
}
