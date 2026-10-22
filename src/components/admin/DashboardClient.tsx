'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

export type DashboardData = {
  userName: string
  userRole: string
  userEmail: string
  coursesCount: number
  publishedCourses: number
  draftCourses: number
  studentsCount: number
  activeEnrollmentsCount: number
  lessonsCount: number
  videoLessonsCount: number
  totalReviewsCount: number
  pendingReviewsCount: number
  recentEnrollments: Array<{
    id: string | number
    studentName: string
    courseTitle: string
    source: string
    date: string
  }>
}

export function DashboardClient({ data }: { data: DashboardData }) {
  const [isSkeleton, setIsSkeleton] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const currentDate = mounted
    ? new Date().toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Live Studio'

  return (
    <div className="w-full max-w-7xl mx-auto py-2 px-1 space-y-6 font-sans">
      {/* Top Utility Bar */}
      <div className="flex flex-wrap items-center justify-between p-3.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-sm gap-3">
        <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulseGlow" />
          <span className="font-bold text-slate-900 dark:text-white tracking-tight">Production Engine</span>
          <span className="text-slate-300 dark:text-zinc-700">•</span>
          <span className="text-slate-400 dark:text-zinc-500 text-[11px]">PostgreSQL Connected</span>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-zinc-800/80 px-2.5 py-1 rounded-md border border-slate-200 dark:border-zinc-700">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {currentDate}
          </span>

          {/* Interactive Skeleton Shimmer Toggle */}
          <button
            type="button"
            className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
              isSkeleton
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/25'
                : 'bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800'
            }`}
            onClick={() => setIsSkeleton(!isSkeleton)}
            title="Toggle Skeleton Shimmer Animation Preview"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            <span>{isSkeleton ? 'Show Live Data' : 'Skeleton Shimmer'}</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-200 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700/60 transition-all shadow-sm"
          >
            <span>Live Site</span>
            <svg className="w-3 h-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-lg text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-all shadow-sm"
          >
            <span>Student Space</span>
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Hero Welcome Command Banner */}
      <section className="relative overflow-hidden rounded-2xl p-7 md:p-9 bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-950 text-white shadow-xl border border-white/10">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-500/20 via-emerald-500/10 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-indigo-500/30 flex-shrink-0">
              <span>{data.userName.slice(0, 2).toUpperCase()}</span>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Role: {data.userRole}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-slate-300 border border-white/10">
                  Tailwind v3 • Payload v3
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                  Session: 7 Days
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                {isSkeleton ? (
                  <span className="inline-block w-64 h-8 rounded bg-slate-800 animate-shimmer" />
                ) : (
                  <>Welcome back, {data.userName}.</>
                )}
              </h1>
              <p className="text-xs md:text-sm text-slate-400 max-w-xl leading-relaxed">
                {isSkeleton ? (
                  <span className="inline-block w-96 h-4 rounded bg-slate-800 animate-shimmer" />
                ) : (
                  <>Studio command is active. Manage your courses, curriculum, students, and publish modern learning experiences across Fieldnotes.</>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="bg-white/5 border border-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl flex flex-col gap-0.5">
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Curriculum</span>
              <span className="text-sm font-bold text-white">{data.coursesCount} Courses</span>
            </div>
            <div className="bg-white/5 border border-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl flex flex-col gap-0.5">
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Video Stream</span>
              <span className="text-sm font-bold text-emerald-400">100% Ready</span>
            </div>
            <div className="bg-white/5 border border-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl flex flex-col gap-0.5">
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Moderation</span>
              <span className="text-sm font-bold text-sky-400">Queue Clean</span>
            </div>
          </div>
        </div>
      </section>

      {/* KPI Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Courses */}
        <Link
          href="/admin/collections/courses"
          className="group relative flex flex-col justify-between p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
              <span>{data.publishedCourses} Live</span>
            </span>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Courses</span>
            {isSkeleton ? (
              <div className="w-24 h-10 rounded bg-slate-200 dark:bg-zinc-800 animate-shimmer my-2" />
            ) : (
              <div className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight my-1">
                {data.coursesCount}
              </div>
            )}
            <div className="mt-3 space-y-1.5">
              <div className="w-full h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${data.coursesCount > 0 ? (data.publishedCourses / data.coursesCount) * 100 : 100}%` }}
                />
              </div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {data.publishedCourses} published • {data.draftCourses} drafts
              </span>
            </div>
          </div>
        </Link>

        {/* Card 2: Active Students */}
        <Link
          href="/admin/collections/enrollments"
          className="group relative flex flex-col justify-between p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 14 14" />
              </svg>
              <span>{data.activeEnrollmentsCount} Enrollments</span>
            </span>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Learners</span>
            {isSkeleton ? (
              <div className="w-24 h-10 rounded bg-slate-200 dark:bg-zinc-800 animate-shimmer my-2" />
            ) : (
              <div className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight my-1">
                {data.studentsCount}
              </div>
            )}
            <div className="mt-3 space-y-1.5">
              <div className="w-full h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '85%' }} />
              </div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {data.activeEnrollmentsCount} active student enrollments
              </span>
            </div>
          </div>
        </Link>

        {/* Card 3: Video Lessons */}
        <Link
          href="/admin/collections/lessons"
          className="group relative flex flex-col justify-between p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-sky-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
              <span>Mux Video</span>
            </span>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Curriculum Modules</span>
            {isSkeleton ? (
              <div className="w-24 h-10 rounded bg-slate-200 dark:bg-zinc-800 animate-shimmer my-2" />
            ) : (
              <div className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight my-1">
                {data.lessonsCount}
              </div>
            )}
            <div className="mt-3 space-y-1.5">
              <div className="w-full h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-500 rounded-full transition-all duration-500"
                  style={{ width: `${data.lessonsCount > 0 ? (data.videoLessonsCount / data.lessonsCount) * 100 : 100}%` }}
                />
              </div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {data.videoLessonsCount} video lessons streamable
              </span>
            </div>
          </div>
        </Link>

        {/* Card 4: Reviews & Feedback */}
        <Link
          href="/admin/collections/reviews"
          className="group relative flex flex-col justify-between p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                data.pendingReviewsCount > 0
                  ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
                  : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
              }`}
            >
              {data.pendingReviewsCount > 0 ? 'Pending Action' : 'Approved'}
            </span>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Student Feedback</span>
            {isSkeleton ? (
              <div className="w-24 h-10 rounded bg-slate-200 dark:bg-zinc-800 animate-shimmer my-2" />
            ) : (
              <div className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight my-1">
                {data.totalReviewsCount}
              </div>
            )}
            <div className="mt-3 space-y-1.5">
              <div className="w-full h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${data.pendingReviewsCount > 0 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: '100%' }}
                />
              </div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {data.pendingReviewsCount > 0
                  ? `${data.pendingReviewsCount} review(s) awaiting approval`
                  : 'All course reviews published'}
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* Quick Action Command Strip */}
      <section className="p-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
            QUICK DISPATCH
          </span>
          <span className="text-[11px] text-slate-400">Instant Content Shortcuts</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/admin/collections/courses/create"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:bg-indigo-600 hover:border-indigo-600 hover:text-white transition-all shadow-sm"
          >
            <span className="text-indigo-500 font-bold group-hover:text-white">+</span>
            <span>Course</span>
          </Link>
          <Link
            href="/admin/collections/sections/create"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:bg-sky-600 hover:border-sky-600 hover:text-white transition-all shadow-sm"
          >
            <span className="text-sky-500 font-bold">+</span>
            <span>Section</span>
          </Link>
          <Link
            href="/admin/collections/lessons/create"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:bg-emerald-600 hover:border-emerald-600 hover:text-white transition-all shadow-sm"
          >
            <span className="text-emerald-500 font-bold">+</span>
            <span>Lesson</span>
          </Link>
          <Link
            href="/admin/collections/posts/create"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:bg-purple-600 hover:border-purple-600 hover:text-white transition-all shadow-sm"
          >
            <span className="text-purple-500 font-bold">+</span>
            <span>Journal Post</span>
          </Link>
          <Link
            href="/admin/collections/pages/create"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:bg-teal-600 hover:border-teal-600 hover:text-white transition-all shadow-sm"
          >
            <span className="text-teal-500 font-bold">+</span>
            <span>Page</span>
          </Link>
          <Link
            href="/admin/collections/media/create"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:bg-rose-600 hover:border-rose-600 hover:text-white transition-all shadow-sm"
          >
            <span className="text-rose-500 font-bold">↑</span>
            <span>Upload Media</span>
          </Link>
          <Link
            href="/admin/globals/site-settings"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:bg-amber-600 hover:border-amber-600 hover:text-white transition-all shadow-sm"
          >
            <span>⚙</span>
            <span>Settings</span>
          </Link>
        </div>
      </section>

      {/* Two-Column Analytics & Live Feeds */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recent Activity Feed (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <h3 className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">
                Recent Student Enrollments
              </h3>
            </div>
            <Link
              href="/admin/collections/enrollments"
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              <span>View All</span>
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </Link>
          </div>

          <div className="p-5 flex-1">
            {isSkeleton ? (
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 animate-shimmer">
                    <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-zinc-700" />
                    <div className="flex-1 space-y-1">
                      <div className="w-32 h-3.5 bg-slate-200 dark:bg-zinc-700 rounded" />
                      <div className="w-48 h-2.5 bg-slate-200 dark:bg-zinc-700 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : data.recentEnrollments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-zinc-800 text-left text-slate-400 uppercase font-bold tracking-wider">
                      <th className="pb-3 pl-2">Student</th>
                      <th className="pb-3">Curriculum</th>
                      <th className="pb-3">Method</th>
                      <th className="pb-3 pr-2">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                    {data.recentEnrollments.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors">
                        <td className="py-3 pl-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-100 to-sky-100 text-indigo-700 font-bold flex items-center justify-center text-[10px]">
                              {item.studentName.slice(0, 2).toUpperCase()}
                            </div>
                            <span className="font-semibold text-slate-900 dark:text-white">{item.studentName}</span>
                          </div>
                        </td>
                        <td className="py-3 text-slate-600 dark:text-slate-300">
                          <span className="bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded border border-slate-200 dark:border-zinc-700 font-medium">
                            {item.courseTitle}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                            {item.source}
                          </span>
                        </td>
                        <td className="py-3 pr-2 text-slate-400">{item.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 px-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">No Recent Enrollments Recorded</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                  Student registrations and new course enrollments will appear here in real time.
                </p>
                <Link
                  href="/admin/collections/enrollments/create"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:bg-slate-50"
                >
                  + Enroll Student Manually
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right: Studio Health & Quick Navigation (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <h3 className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">
                Curriculum Health & Shortcuts
              </h3>
            </div>
            <Link
              href="/admin/collections/reviews"
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              <span>Reviews Queue</span>
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </Link>
          </div>

          <div className="p-5 flex-1 space-y-5">
            {/* Moderation Status Banner */}
            {data.pendingReviewsCount > 0 ? (
              <div className="flex gap-3 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                <span className="text-lg">⚠️</span>
                <div>
                  <h5 className="font-bold text-xs text-amber-900 dark:text-amber-200">
                    {data.pendingReviewsCount} Review(s) Awaiting Moderation
                  </h5>
                  <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5 mb-2">
                    Students submitted new course feedback requiring administrator approval.
                  </p>
                  <Link
                    href="/admin/collections/reviews"
                    className="text-[11px] font-bold text-amber-800 dark:text-amber-200 underline"
                  >
                    Review and Approve ↗
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <h5 className="font-bold text-xs text-emerald-900 dark:text-emerald-200">Review Queue Is Clean</h5>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400">All student feedback has been moderated and published.</p>
                </div>
              </div>
            )}

            {/* Health Metrics Progress Bars */}
            <div className="p-4 bg-slate-50 dark:bg-zinc-800/60 rounded-xl border border-slate-200 dark:border-zinc-700/80 space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Course Publishing Index</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {data.coursesCount > 0 ? Math.round((data.publishedCourses / data.coursesCount) * 100) : 100}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${data.coursesCount > 0 ? (data.publishedCourses / data.coursesCount) * 100 : 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Video Stream Coverage</span>
                  <span className="font-bold text-sky-600 dark:text-sky-400">
                    {data.lessonsCount > 0 ? Math.round((data.videoLessonsCount / data.lessonsCount) * 100) : 100}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-500 rounded-full"
                    style={{ width: `${data.lessonsCount > 0 ? (data.videoLessonsCount / data.lessonsCount) * 100 : 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Shortcuts Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <Link
                href="/admin/collections/categories"
                className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/80 hover:border-indigo-500 hover:bg-white dark:hover:bg-zinc-800 transition-all group"
              >
                <span className="text-base">🏷️</span>
                <div className="flex-1">
                  <span className="block text-xs font-bold text-slate-900 dark:text-white">Categories</span>
                  <span className="block text-[10px] text-slate-400">Taxonomy</span>
                </div>
                <span className="text-slate-400 group-hover:translate-x-0.5 group-hover:text-indigo-600 transition-all text-xs">→</span>
              </Link>

              <Link
                href="/admin/collections/instructors"
                className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/80 hover:border-indigo-500 hover:bg-white dark:hover:bg-zinc-800 transition-all group"
              >
                <span className="text-base">👨‍🏫</span>
                <div className="flex-1">
                  <span className="block text-xs font-bold text-slate-900 dark:text-white">Instructors</span>
                  <span className="block text-[10px] text-slate-400">Faculty</span>
                </div>
                <span className="text-slate-400 group-hover:translate-x-0.5 group-hover:text-indigo-600 transition-all text-xs">→</span>
              </Link>

              <Link
                href="/admin/collections/course-resources"
                className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/80 hover:border-indigo-500 hover:bg-white dark:hover:bg-zinc-800 transition-all group"
              >
                <span className="text-base">📁</span>
                <div className="flex-1">
                  <span className="block text-xs font-bold text-slate-900 dark:text-white">Files & PDFs</span>
                  <span className="block text-[10px] text-slate-400">Downloads</span>
                </div>
                <span className="text-slate-400 group-hover:translate-x-0.5 group-hover:text-indigo-600 transition-all text-xs">→</span>
              </Link>

              <Link
                href="/admin/collections/users"
                className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/80 hover:border-indigo-500 hover:bg-white dark:hover:bg-zinc-800 transition-all group"
              >
                <span className="text-base">🔐</span>
                <div className="flex-1">
                  <span className="block text-xs font-bold text-slate-900 dark:text-white">Users</span>
                  <span className="block text-[10px] text-slate-400">Permissions</span>
                </div>
                <span className="text-slate-400 group-hover:translate-x-0.5 group-hover:text-indigo-600 transition-all text-xs">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative Collections Header Divider */}
      <div className="flex items-center gap-4 pt-2">
        <div className="flex-1 h-px bg-slate-200 dark:bg-zinc-800" />
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
          DATABASE ARCHITECTURE & COLLECTIONS
        </span>
        <div className="flex-1 h-px bg-slate-200 dark:bg-zinc-800" />
      </div>
    </div>
  )
}
