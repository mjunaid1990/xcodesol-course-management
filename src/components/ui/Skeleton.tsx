'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl bg-slate-800/60 before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent',
        className
      )}
      {...props}
    />
  )
}

export function StatsCardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-2xl border border-slate-800/80 bg-[#0e1424] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-10 rounded-xl" />
          </div>
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-4 w-28" />
        </div>
      ))}
    </div>
  )
}

export function CourseCardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-2xl border border-slate-800 bg-[#0e1424] overflow-hidden">
          <Skeleton className="h-44 w-full rounded-none" />
          <div className="p-5 space-y-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
            <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-28 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0e1424] p-4 space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-slate-800">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-8 w-28 rounded-xl" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-xl" />
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-2.5 w-44" />
              </div>
            </div>
            <Skeleton className="h-4 w-20 rounded-full" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-7 w-20 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function CurriculumSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2].map((s) => (
        <div key={s} className="rounded-2xl border border-slate-800 bg-[#0e1424] p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <Skeleton className="h-5 w-56" />
            <Skeleton className="h-7 w-24 rounded-lg" />
          </div>
          <div className="space-y-2.5">
            {[1, 2, 3].map((l) => (
              <div key={l} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-7 w-7 rounded-lg" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-20 rounded-md" />
                  <Skeleton className="h-6 w-6 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
