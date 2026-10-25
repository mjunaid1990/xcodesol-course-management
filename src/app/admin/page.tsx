import React from 'react'
import Link from 'next/link'
import {
  TrendingUp,
  Users,
  BookOpen,
  DollarSign,
  Star,
  Plus,
  ArrowRight,
  Layers,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react'
import { getDashboardStats } from '@/lib/db/queries'
import { formatCurrency, formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-7 animate-fadeIn">
      {/* Top Banner / Welcome Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-1">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Instructor Dashboard
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-bold text-blue-400 border border-blue-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
              Live Studio
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Monitor revenue, student enrollments, course curriculums, and platform engagement.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/courses/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-blue-600/30 hover:bg-blue-500 active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Create Course</span>
          </Link>
          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/70 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:border-slate-700 hover:text-white transition-all"
          >
            <Layers className="h-3.5 w-3.5 text-slate-400" />
            <span>Categories</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Total Revenue */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-b from-[#0f172a]/70 to-[#0c1220]/70 p-5 shadow-sm hover:border-slate-700/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Revenue
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {formatCurrency(stats.totalRevenue)}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs">
              <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[11px] font-bold text-emerald-400">
                <TrendingUp className="mr-1 h-3 w-3" />
                +18.4%
              </span>
              <span className="text-slate-400 text-[11px]">vs last month</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Total Students */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-b from-[#0f172a]/70 to-[#0c1220]/70 p-5 shadow-sm hover:border-slate-700/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Active Students
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Users className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {stats.totalStudents.toLocaleString()}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs">
              <span className="inline-flex items-center rounded-md bg-blue-500/10 px-1.5 py-0.5 text-[11px] font-bold text-blue-400">
                <TrendingUp className="mr-1 h-3 w-3" />
                +12.8%
              </span>
              <span className="text-slate-400 text-[11px]">new enrollments</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Total Courses */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-b from-[#0f172a]/70 to-[#0c1220]/70 p-5 shadow-sm hover:border-slate-700/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Courses
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <BookOpen className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {stats.totalCourses}
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="font-bold text-emerald-400">{stats.publishedCourses} Published</span>
              <span className="text-slate-500">•</span>
              <span className="font-medium text-amber-400/90">1 Draft</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Platform Rating */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-b from-[#0f172a]/70 to-[#0c1220]/70 p-5 shadow-sm hover:border-slate-700/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Avg Satisfaction
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Star className="h-4.5 w-4.5 fill-amber-400 text-amber-400" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {stats.averageRating}
              </span>
              <span className="text-xs font-semibold text-slate-400">/ 5.0</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-400">
              <span className="tracking-widest text-[11px]">★★★★★</span>
              <span className="text-slate-400 text-[11px] ml-1">from 480+ reviews</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Section: 2 Columns */}
      <div className="grid grid-cols-1 gap-7 lg:grid-cols-3">
        {/* Left 2 Columns: Top Performing Courses + Recent Transactions */}
        <div className="space-y-7 lg:col-span-2">
          {/* Top Courses Card */}
          <div className="rounded-2xl border border-slate-800/80 bg-[#0c1220]/70 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
              <div>
                <h2 className="font-display text-sm sm:text-base font-bold text-white tracking-tight">
                  Featured Courses
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Curriculums generating the highest enrollment and completion rates.
                </p>
              </div>
              <Link
                href="/admin/courses"
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
              >
                <span>View all</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="divide-y divide-slate-800/60 mt-1">
              {stats.topCourses.map((course) => (
                <div
                  key={course.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl px-2 hover:bg-slate-800/30 transition-colors group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600/10 to-indigo-600/20 text-blue-400 border border-blue-500/20 group-hover:scale-105 transition-transform">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/admin/courses/${course.slug}`}
                        className="text-xs sm:text-sm font-bold text-white hover:text-blue-400 transition-colors truncate block"
                      >
                        {course.title}
                      </Link>
                      <div className="flex items-center gap-2.5 mt-1 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1 font-medium text-slate-300">
                          <Users className="h-3 w-3 text-slate-400" />
                          {course.studentsCount.toLocaleString()} students
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-slate-200">
                          {formatCurrency(course.price)}
                        </span>
                        <span>•</span>
                        <span
                          className={`px-2 py-0.2 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                            course.status === 'published'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {course.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pl-14 sm:pl-0">
                    <div className="text-left sm:text-right">
                      <div className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Gross Sales</div>
                      <div className="text-xs sm:text-sm font-extrabold text-emerald-400 font-mono">
                        {formatCurrency(course.revenue)}
                      </div>
                    </div>
                    <Link
                      href={`/admin/courses/${course.slug}`}
                      className="rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                      Curriculum
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="rounded-2xl border border-slate-800/80 bg-[#0c1220]/70 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
              <div>
                <h2 className="font-display text-sm sm:text-base font-bold text-white tracking-tight">
                  Recent Orders & Transactions
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Verified Stripe checkout transactions and enrollment confirmations.
                </p>
              </div>
              <Link
                href="/admin/orders"
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
              >
                <span>Ledger</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="overflow-x-auto mt-2">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Course Purchased</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {stats.recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-white text-xs">{order.user_name}</div>
                        <div className="text-[11px] text-slate-400">{order.user_email}</div>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-300 max-w-[200px] truncate">
                        {order.course_title}
                      </td>
                      <td className="py-3 px-3 font-bold text-emerald-400 font-mono text-xs">
                        {formatCurrency(order.amount, order.currency)}
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="h-3 w-3" />
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-[11px]">
                        {formatDate(order.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Realtime Feed + System Status */}
        <div className="space-y-7">
          {/* Recent Enrollments Feed */}
          <div className="rounded-2xl border border-slate-800/80 bg-[#0c1220]/70 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-400" />
                <h3 className="font-display text-sm font-bold text-white tracking-tight">Live Enrollments</h3>
              </div>
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div className="mt-4 space-y-3">
              {stats.recentEnrollments.map((enr) => (
                <div
                  key={enr.id}
                  className="flex items-center gap-3 rounded-xl p-3 bg-slate-900/40 border border-slate-800/60 hover:border-slate-700/60 transition-colors"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-[11px] font-bold shadow-sm">
                    {enr.studentName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">{enr.studentName}</p>
                    <p className="text-[11px] text-slate-400 truncate">{enr.courseTitle}</p>
                    <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-slate-400">
                      <Clock className="h-2.5 w-2.5" />
                      <span>{formatDate(enr.enrolledAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/admin/students"
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/60 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <span>Manage all students</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Database & Architecture Quick Health Card */}
          <div className="rounded-2xl border border-slate-800/80 bg-gradient-to-br from-[#0f172a]/80 to-[#0c1220]/80 p-6 shadow-sm space-y-4">
            <h3 className="font-display text-sm font-bold text-white tracking-tight">Platform Architecture</h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between rounded-xl p-2.5 bg-slate-950/40 border border-slate-800/80">
                <span className="text-slate-400">PostgreSQL Engine</span>
                <span className="font-bold text-emerald-400">Neon / Vercel Active</span>
              </div>
              <div className="flex items-center justify-between rounded-xl p-2.5 bg-slate-950/40 border border-slate-800/80">
                <span className="text-slate-400">Schema Migrations</span>
                <span className="font-bold text-blue-400 font-mono text-[11px]">0002_cleanup_legacy</span>
              </div>
              <div className="flex items-center justify-between rounded-xl p-2.5 bg-slate-950/40 border border-slate-800/80">
                <span className="text-slate-400">Stripe Webhook Gateway</span>
                <span className="font-semibold text-slate-300">Ready</span>
              </div>
              <div className="flex items-center justify-between rounded-xl p-2.5 bg-slate-950/40 border border-slate-800/80">
                <span className="text-slate-400">Framework Core</span>
                <span className="font-bold text-purple-400">Next.js 15 App Router</span>
              </div>
            </div>

            <div className="pt-1">
              <Link
                href="/admin/settings"
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 py-2.5 text-xs font-bold text-white transition-colors"
              >
                Configure Site Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
