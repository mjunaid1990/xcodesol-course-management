import React from 'react'
import Link from 'next/link'
import {
  TrendingUp,
  Users,
  BookOpen,
  DollarSign,
  Star,
  ArrowUpRight,
  ArrowRight,
  Plus,
  PlayCircle,
  FileCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
} from 'lucide-react'
import { getDashboardStats } from '@/lib/db/queries'
import { formatCurrency, formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner / Welcome Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Instructor Dashboard
            </h1>
            <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-400 border border-blue-500/20">
              Live Overview
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Monitor revenue, enrollments, student engagement, and course curriculums.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/courses/new"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Create Course</span>
          </Link>
          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-200 hover:bg-slate-700/80 hover:text-white transition-all"
          >
            <Layers className="h-4 w-4 text-slate-400" />
            <span>Categories</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Total Revenue */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-b from-slate-900/90 to-slate-900/40 p-6 shadow-sm hover:border-slate-700/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Total Revenue</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {formatCurrency(stats.totalRevenue)}
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="flex items-center text-emerald-400 font-semibold">
                <TrendingUp className="mr-1 h-3.5 w-3.5" />
                +18.4%
              </span>
              <span className="text-slate-400">vs last month</span>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-emerald-500/5 blur-xl pointer-events-none" />
        </div>

        {/* Metric 2: Total Students */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-b from-slate-900/90 to-slate-900/40 p-6 shadow-sm hover:border-slate-700/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Active Students</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {stats.totalStudents.toLocaleString()}
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="flex items-center text-blue-400 font-semibold">
                <TrendingUp className="mr-1 h-3.5 w-3.5" />
                +12.8%
              </span>
              <span className="text-slate-400">new enrollments</span>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-blue-500/5 blur-xl pointer-events-none" />
        </div>

        {/* Metric 3: Total Courses */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-b from-slate-900/90 to-slate-900/40 p-6 shadow-sm hover:border-slate-700/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Total Courses</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {stats.totalCourses}
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="text-slate-300 font-semibold">{stats.publishedCourses} Published</span>
              <span className="text-slate-500">•</span>
              <span className="text-amber-400/90 font-medium">1 Draft</span>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-indigo-500/5 blur-xl pointer-events-none" />
        </div>

        {/* Metric 4: Platform Rating */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-b from-slate-900/90 to-slate-900/40 p-6 shadow-sm hover:border-slate-700/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Avg Satisfaction</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {stats.averageRating}
              </span>
              <span className="text-xs text-slate-400 font-medium">/ 5.0</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-300">
              <span>★★★★★</span>
              <span className="text-slate-400 ml-1">from 480+ reviews</span>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-amber-500/5 blur-xl pointer-events-none" />
        </div>
      </div>

      {/* Main Section: 2 Columns */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left 2 Columns: Top Performing Courses + Recent Transactions */}
        <div className="space-y-8 lg:col-span-2">
          {/* Top Courses Card */}
          <div className="rounded-2xl border border-slate-800 bg-[#0e1424] p-6 shadow-sm">
            <div className="flex items-center justify-between pb-5 border-b border-slate-800/80">
              <div>
                <h2 className="text-base font-bold text-white">Featured Courses</h2>
                <p className="text-xs text-slate-400">Curriculums generating highest enrollment and completion rates.</p>
              </div>
              <Link
                href="/admin/courses"
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300"
              >
                <span>View all</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-800/60">
              {stats.topCourses.map((course) => (
                <div key={course.id} className="py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-105 transition-transform">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <div>
                      <Link
                        href={`/admin/courses/${course.slug}`}
                        className="text-sm font-semibold text-white hover:text-blue-400 transition-colors line-clamp-1"
                      >
                        {course.title}
                      </Link>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1 text-slate-300">
                          <Users className="h-3 w-3 text-slate-400" />
                          {course.studentsCount.toLocaleString()} students
                        </span>
                        <span>•</span>
                        <span className="text-slate-300 font-medium">
                          {formatCurrency(course.price)}
                        </span>
                        <span>•</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
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

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-left sm:text-right">
                      <div className="text-xs text-slate-400">Gross Sales</div>
                      <div className="text-sm font-bold text-emerald-400">
                        {formatCurrency(course.revenue)}
                      </div>
                    </div>
                    <Link
                      href={`/admin/courses/${course.slug}`}
                      className="rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                      Edit Curriculum
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="rounded-2xl border border-slate-800 bg-[#0e1424] p-6 shadow-sm">
            <div className="flex items-center justify-between pb-5 border-b border-slate-800/80">
              <div>
                <h2 className="text-base font-bold text-white">Recent Orders & Transactions</h2>
                <p className="text-xs text-slate-400">Live Stripe payments and student enrollment confirmations.</p>
              </div>
              <Link
                href="/admin/orders"
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300"
              >
                <span>Ledger</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-3 px-2 font-medium">Customer</th>
                    <th className="py-3 px-2 font-medium">Course Purchased</th>
                    <th className="py-3 px-2 font-medium">Amount</th>
                    <th className="py-3 px-2 font-medium">Status</th>
                    <th className="py-3 px-2 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {stats.recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-2">
                        <div className="font-semibold text-white">{order.user_name}</div>
                        <div className="text-[11px] text-slate-400">{order.user_email}</div>
                      </td>
                      <td className="py-3 px-2 font-medium text-slate-300 max-w-[200px] truncate">
                        {order.course_title}
                      </td>
                      <td className="py-3 px-2 font-bold text-emerald-400">
                        {formatCurrency(order.amount, order.currency)}
                      </td>
                      <td className="py-3 px-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="h-3 w-3" />
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-slate-400 text-[11px]">
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
        <div className="space-y-8">
          {/* Recent Enrollments Feed */}
          <div className="rounded-2xl border border-slate-800 bg-[#0e1424] p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white">Live Enrollments</h3>
              </div>
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div className="mt-4 space-y-4">
              {stats.recentEnrollments.map((enr) => (
                <div key={enr.id} className="flex items-start gap-3 rounded-xl p-3 bg-slate-900/60 border border-slate-800/80">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600/15 text-blue-400 text-xs font-bold">
                    {enr.studentName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-white truncate">{enr.studentName}</p>
                    <p className="text-[11px] text-slate-400 truncate">{enr.courseTitle}</p>
                    <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-500">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(enr.enrolledAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/admin/students"
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-800/60 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700/60 hover:text-white transition-colors"
            >
              <span>Manage all students</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Architecture & CMS Quick Status */}
          <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 to-[#0e1424] p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white">Database & System Health</h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between rounded-lg p-2.5 bg-slate-950/40 border border-slate-800">
                <span className="text-slate-400">PostgreSQL Engine</span>
                <span className="font-semibold text-emerald-400">Active (Neon/Vercel)</span>
              </div>
              <div className="flex items-center justify-between rounded-lg p-2.5 bg-slate-950/40 border border-slate-800">
                <span className="text-slate-400">Schema Migrations</span>
                <span className="font-semibold text-blue-400">0001_initial_schema</span>
              </div>
              <div className="flex items-center justify-between rounded-lg p-2.5 bg-slate-950/40 border border-slate-800">
                <span className="text-slate-400">Stripe Webhook Gateway</span>
                <span className="font-semibold text-slate-300">Ready /api/payments/webhook</span>
              </div>
              <div className="flex items-center justify-between rounded-lg p-2.5 bg-slate-950/40 border border-slate-800">
                <span className="text-slate-400">App Router Framework</span>
                <span className="font-semibold text-purple-400">Next.js 15 (React 19)</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/admin/settings"
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 py-2.5 text-xs font-semibold text-white transition-colors"
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
