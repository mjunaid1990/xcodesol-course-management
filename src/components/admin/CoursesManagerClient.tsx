'use client'

import React, { useState, useTransition, useDeferredValue } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Plus,
  Search,
  Users,
  ExternalLink,
  Edit3,
  Trash2,
  Layers,
  AlertTriangle,
  LayoutList,
  LayoutGrid,
  Clock,
  Sparkles,
} from 'lucide-react'
import { Course } from '@/lib/db/queries'
import { formatCurrency } from '@/lib/utils'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/FormField'
import { ListRowSkeleton, CourseCardSkeleton } from '@/components/ui/Skeleton'
import { showToast } from '@/lib/toast'
import { deleteCourseAction } from '@/app/actions/admin-actions'

interface Props {
  initialCourses: Course[]
}

export function CoursesManagerClient({ initialCourses }: Props) {
  const [courses, setCourses] = useState<Course[]>(initialCourses)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null)
  const [isPending, startTransition] = useTransition()

  const deferredSearch = useDeferredValue(search)
  const isSearching = search !== deferredSearch

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(deferredSearch.toLowerCase()) ||
      (c.category_name && c.category_name.toLowerCase().includes(deferredSearch.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleDelete = () => {
    if (!deleteTarget) return

    startTransition(async () => {
      const res = await deleteCourseAction(deleteTarget.id)
      if (res.success) {
        setCourses((prev) => prev.filter((c) => c.id !== deleteTarget.id))
        showToast.success('Course Deleted', `"${deleteTarget.title}" was removed.`)
      } else {
        showToast.error('Delete Failed', res.error)
      }
      setDeleteTarget(null)
    })
  }

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Course Catalog
            </h1>
            <span className="rounded-full bg-brand-500/10 px-2.5 py-0.5 text-xs font-bold text-brand-400 border border-brand-500/20">
              {courses.length} Curriculums
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Create, manage modules, configure video lessons, and review catalog status.
          </p>
        </div>

        <Link
          href="/admin/courses/new"
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-brand-600/25 hover:from-brand-500 hover:to-indigo-500 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>New Course</span>
        </Link>
      </div>

      {/* Filter, Search & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row gap-3.5 items-center justify-between rounded-2xl border border-white/[0.07] bg-[#0c0e17]/85 luxury-card p-3 sm:p-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/[0.07] bg-slate-950/80 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all"
          />
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
          {/* Status Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {(['all', 'published', 'draft'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold capitalize transition-all cursor-pointer ${
                  statusFilter === status
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30'
                    : 'border border-white/[0.06] bg-slate-900/40 text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {status === 'all' ? 'All' : status}
              </button>
            ))}
          </div>

          {/* View Mode Toggle: List vs Grid */}
          <div className="flex items-center rounded-xl border border-white/[0.07] bg-slate-950/80 p-0.5">
            <button
              onClick={() => setViewMode('list')}
              className={`rounded-lg p-1.5 transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="List View"
            >
              <LayoutList className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded-lg p-1.5 transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* SKELETON ANIMATION DURING CRUD / FILTER TRANSITIONS */}
      {isSearching || isPending ? (
        viewMode === 'list' ? (
          <ListRowSkeleton count={4} />
        ) : (
          <CourseCardSkeleton />
        )
      ) : filteredCourses.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-[#0c0e17]/80 luxury-card p-12 text-center">
          <BookOpen className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white">No courses found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or clear the filter to view all curriculums.
          </p>
        </div>
      ) : viewMode === 'list' ? (
        /* ELEGANT LIST VIEW */
        <div className="space-y-2.5">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-white/[0.07] bg-[#0c0e17]/80 luxury-card hover:border-brand-500/30 transition-all duration-200 group"
            >
              {/* Left Column: Icon/Thumb, Title & Meta */}
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-900 border border-white/[0.08]">
                  {course.thumbnail_url ? (
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-600/20 to-indigo-600/20 text-brand-400">
                      <BookOpen className="h-5 w-5" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-brand-400 truncate">
                      {course.category_name || 'Development'}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-[11px] font-medium text-slate-400 capitalize">
                      {course.level}
                    </span>
                  </div>

                  <Link
                    href={`/admin/courses/${course.slug}`}
                    className="font-display text-sm font-bold text-white hover:text-brand-300 transition-colors truncate block mt-0.5"
                  >
                    {course.title}
                  </Link>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Layers className="h-3 w-3 text-slate-500" />
                      {course.sections_count || 4} modules
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-slate-500" />
                      {course.students_count?.toLocaleString() || 0} students
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Price, Status Badge & Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-3.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.05]">
                <div className="text-left sm:text-right mr-2">
                  <span className="text-xs font-mono font-bold text-emerald-400 block">
                    {formatCurrency(course.price, course.currency)}
                  </span>
                  <span
                    className={`inline-block mt-0.5 px-2 py-0.2 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      course.status === 'published'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {course.status}
                  </span>
                </div>

                <Link
                  href={`/admin/courses/${course.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-brand-500/40 hover:text-white transition-colors"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Curriculum</span>
                </Link>

                <button
                  onClick={() => setDeleteTarget(course)}
                  className="rounded-xl border border-white/[0.07] bg-slate-950 p-2 text-slate-500 hover:text-rose-400 hover:border-rose-500/30 transition-colors cursor-pointer"
                  title="Delete Course"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>

                <Link
                  href={`/courses/${course.slug}`}
                  target="_blank"
                  className="rounded-xl border border-white/[0.07] bg-slate-950 p-2 text-slate-500 hover:text-white hover:border-white/20 transition-colors"
                  title="View Public Course"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0c0e17]/80 luxury-card hover:border-brand-500/30 transition-all duration-200 group"
            >
              <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                {course.thumbnail_url ? (
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-600/20 to-indigo-600/20 text-brand-400">
                    <BookOpen className="h-12 w-12" />
                  </div>
                )}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md ${
                      course.status === 'published'
                        ? 'bg-emerald-500/80 text-white'
                        : 'bg-amber-500/80 text-white'
                    }`}
                  >
                    {course.status}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-xs font-mono font-bold text-white border border-white/10">
                    {formatCurrency(course.price, course.currency)}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <span className="text-[11px] font-bold text-brand-400 mb-1">
                  {course.category_name || 'Development'}
                </span>
                <h2 className="font-display text-base font-bold text-white group-hover:text-brand-300 transition-colors line-clamp-1">
                  {course.title}
                </h2>
                <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed flex-1">
                  {course.summary || 'Interactive video lessons and guides.'}
                </p>

                <div className="mt-4 pt-3.5 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
                  <span>{course.sections_count || 4} modules</span>
                  <span>{course.students_count?.toLocaleString() || 0} students</span>
                </div>

                <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center gap-2">
                  <Link
                    href={`/admin/courses/${course.slug}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 border border-white/[0.08] hover:border-brand-500/40 py-2 text-xs font-semibold text-slate-200 transition-all"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Curriculum</span>
                  </Link>

                  <button
                    onClick={() => setDeleteTarget(course)}
                    className="rounded-xl border border-white/[0.07] bg-slate-950 p-2 text-slate-500 hover:text-rose-400 hover:border-rose-500/30 transition-colors cursor-pointer"
                    title="Delete Course"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Course Modal */}
      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete Course"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl bg-rose-500/10 p-3 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <p className="text-xs leading-relaxed">
              Are you sure you want to delete <span className="font-bold">"{deleteTarget?.title}"</span>? All modules, lessons, and enrollment records will be permanently removed.
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} isLoading={isPending}>
              Delete Course
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
