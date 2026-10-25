'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl bg-slate-800/40 before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/[0.08] before:to-transparent',
        className
      )}
      {...props}
    />
  )
}

/**
 * Dedicated Skeleton for List rows in Courses, Students, Categories, and Orders
 */
export function ListRowSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2.5 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-4 rounded-2xl border border-white/[0.05] bg-[#0c0e17]/80 luxury-card animate-fadeIn"
        >
          <div className="flex items-center gap-3.5 min-w-0 flex-1">
            <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
            <div className="space-y-1.5 min-w-0 flex-1 max-w-md">
              <Skeleton className="h-4 w-3/5 rounded-md" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-20 rounded" />
                <Skeleton className="h-3 w-16 rounded" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <Skeleton className="h-5 w-20 rounded-full hidden sm:block" />
            <Skeleton className="h-5 w-16 rounded-md hidden md:block" />
            <Skeleton className="h-8 w-24 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Dedicated Skeleton for Lessons inside Curriculum Modules
 */
export function LessonItemSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-2 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-3 rounded-xl border border-white/[0.05] bg-slate-900/50"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Skeleton className="h-6 w-6 rounded-lg shrink-0" />
            <Skeleton className="h-4 w-4 rounded-md shrink-0" />
            <Skeleton className="h-3.5 w-48 rounded-md" />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Skeleton className="h-6 w-20 rounded-lg" />
            <Skeleton className="h-6 w-6 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function StatsCardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-2xl border border-white/[0.06] bg-[#0c0e17]/80 luxury-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3.5 w-24 rounded" />
            <Skeleton className="h-9 w-9 rounded-xl" />
          </div>
          <Skeleton className="h-8 w-36 rounded-lg" />
          <Skeleton className="h-4 w-28 rounded-md" />
        </div>
      ))}
    </div>
  )
}

export function CourseCardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-2xl border border-white/[0.06] bg-[#0c0e17]/80 luxury-card overflow-hidden">
          <Skeleton className="h-44 w-full rounded-none" />
          <div className="p-5 space-y-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-3 w-full" />
            <div className="pt-3 border-t border-white/[0.05] flex justify-between items-center">
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
    <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0c0e17]/80 luxury-card p-4 space-y-3">
      <div className="flex justify-between items-center pb-2 border-b border-white/[0.05]">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-7 w-24 rounded-lg" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-xl" />
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
        <div key={s} className="rounded-2xl border border-white/[0.06] bg-[#0c0e17]/80 luxury-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.05]">
            <Skeleton className="h-5 w-56" />
            <Skeleton className="h-7 w-24 rounded-lg" />
          </div>
          <LessonItemSkeleton count={3} />
        </div>
      ))}
    </div>
  )
}
