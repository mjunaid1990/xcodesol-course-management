import React from 'react'
import Link from 'next/link'
import {
  GraduationCap,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  BookOpen,
  LayoutDashboard,
  CheckCircle2,
  Database,
  Layers,
  Code2,
  Users,
  Star,
  ExternalLink,
} from 'lucide-react'
import { getCoursesList, getDashboardStats } from '@/lib/db/queries'
import { formatCurrency } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [courses, stats] = await Promise.all([
    getCoursesList(),
    getDashboardStats(),
  ])

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 px-4 py-2 text-center text-xs font-semibold text-white">
        <span>🚀 Built with Next.js 15, PostgreSQL & Tailwind CSS — Native Architecture</span>
      </div>

      {/* Main Navbar */}
      <header className="border-b border-slate-800/80 bg-[#0d1322]/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-lg shadow-blue-500/25">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-white text-base">Fieldnotes</span>
              <span className="ml-1.5 text-blue-400 font-extrabold text-xs px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                STUDIO
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 active:scale-95 transition-all"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Admin Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden py-20 px-6 lg:py-28 text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400 mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Modern Learning & Curriculum Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Enterprise Course Platform with{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Tailwind Admin Dashboard
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Architected specifically for Next.js 15 and PostgreSQL on Vercel. Manage curriculums, video lessons, free previews, student enrollments, and Stripe transactions from a high-performance visual dashboard.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-600/30 hover:from-blue-500 hover:to-indigo-500 active:scale-95 transition-all"
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Launch Admin Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/admin/courses"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-800/80 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:bg-slate-700 transition-all"
            >
              <BookOpen className="h-4 w-4 text-slate-400" />
              <span>Explore Course Manager</span>
            </Link>
          </div>
        </section>

        {/* Live Course Showcase */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div>
              <h2 className="text-xl font-bold text-white">Current Published Courses</h2>
              <p className="text-xs text-slate-400">Live courses managed through the database schema.</p>
            </div>
            <Link
              href="/admin/courses/new"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
            >
              <span>+ Add new course</span>
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="rounded-2xl border border-slate-800 bg-[#0e1424] overflow-hidden flex flex-col group hover:border-slate-700 transition-all"
              >
                <div className="h-44 bg-slate-900 relative overflow-hidden">
                  {course.thumbnail_url ? (
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-slate-600">
                      <BookOpen className="h-10 w-10" />
                    </div>
                  )}
                  <span className="absolute top-3 right-3 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-xs font-bold text-white border border-white/10">
                    {formatCurrency(course.price, course.currency)}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <span className="text-xs font-semibold text-blue-400">{course.category_name}</span>
                  <h3 className="mt-1 text-sm font-bold text-white line-clamp-1">{course.title}</h3>
                  <p className="mt-2 text-xs text-slate-400 line-clamp-2 flex-1">{course.summary}</p>

                  <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs text-slate-400">{course.sections_count || 4} modules</span>
                    <Link
                      href={`/admin/courses/${course.slug}`}
                      className="text-xs font-semibold text-blue-400 hover:text-blue-300"
                    >
                      Edit in Admin →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0b0f19] py-8 text-center text-xs text-slate-500">
        <p>© 2026 Fieldnotes Studio. Next.js 15, PostgreSQL, and Tailwind CSS.</p>
      </footer>
    </div>
  )
}
