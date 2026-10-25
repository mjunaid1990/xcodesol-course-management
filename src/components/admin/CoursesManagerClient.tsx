'use client'

import React, { useState, useTransition } from 'react'
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
} from 'lucide-react'
import { Course } from '@/lib/db/queries'
import { formatCurrency } from '@/lib/utils'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/FormField'
import { showToast } from '@/lib/toast'
import { deleteCourseAction } from '@/app/actions/admin-actions'

interface Props {
  initialCourses: Course[]
}

export function CoursesManagerClient({ initialCourses }: Props) {
  const [courses, setCourses] = useState<Course[]>(initialCourses)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null)
  const [isPending, startTransition] = useTransition()

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.category_name && c.category_name.toLowerCase().includes(search.toLowerCase()))
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
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Course Management
            </h1>
            <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-400 border border-blue-500/20">
              {courses.length} Total
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Create, edit, organize sections, upload lessons, and configure pricing.
          </p>
        </div>

        <Link
          href="/admin/courses/new"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>New Course</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between rounded-2xl border border-slate-800 bg-[#0e1424] p-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Filter courses by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-700/80 bg-slate-900/80 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {(['all', 'published', 'draft'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold capitalize transition-colors ${
                statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'border border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {status === 'all' ? 'All Statuses' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-[#0e1424] shadow-sm hover:border-slate-700 hover:shadow-lg hover:shadow-blue-900/10 transition-all duration-200 group"
          >
            {/* Card Thumbnail / Header */}
            <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
              {course.thumbnail_url ? (
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 to-blue-950/40 text-slate-600">
                  <BookOpen className="h-12 w-12" />
                </div>
              )}

              {/* Badges on Thumbnail */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                    course.status === 'published'
                      ? 'bg-emerald-500/80 text-white'
                      : 'bg-amber-500/80 text-white'
                  }`}
                >
                  {course.status}
                </span>
                {course.is_featured && (
                  <span className="bg-blue-600/80 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    Featured
                  </span>
                )}
              </div>

              <div className="absolute top-3 right-3">
                <span className="rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-xs font-bold text-white border border-white/10">
                  {formatCurrency(course.price, course.currency)}
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="flex flex-1 flex-col p-5">
              <div className="text-xs font-semibold text-blue-400 mb-1">
                {course.category_name || 'Development'}
              </div>
              <h2 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                {course.title}
              </h2>
              <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed flex-1">
                {course.summary || 'Comprehensive video course and interactive lessons.'}
              </p>

              {/* Course Meta Info */}
              <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Layers className="h-3.5 w-3.5 text-slate-400" />
                  <span>{course.sections_count || 4} sections</span>
                  <span>•</span>
                  <span>{course.lessons_count || 24} lessons</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Users className="h-3.5 w-3.5 text-slate-400" />
                  <span>{course.students_count?.toLocaleString() || 0} students</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center gap-2">
                <Link
                  href={`/admin/courses/${course.slug}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-800/90 hover:bg-blue-600 hover:text-white py-2 text-xs font-semibold text-slate-200 transition-all"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Edit Curriculum</span>
                </Link>

                <button
                  onClick={() => setDeleteTarget(course)}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:text-rose-400 hover:border-slate-700 transition-colors"
                  title="Delete Course"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <Link
                  href={`/courses/${course.slug}`}
                  target="_blank"
                  className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                  title="View Public Course Page"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

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
              Are you sure you want to delete <span className="font-bold">"{deleteTarget?.title}"</span>? All modules, lessons, and enrollment records for this course will be permanently deleted.
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
