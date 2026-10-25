'use client'

import React, { useState, useTransition } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Save,
  Eye,
  Plus,
  Trash2,
  Video,
  FileText,
  Clock,
  Sparkles,
  GripVertical,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Lock,
  Unlock,
  AlertTriangle,
  Layers,
} from 'lucide-react'
import { Course, Section, Lesson } from '@/lib/db/queries'
import { formatCurrency, formatDuration } from '@/lib/utils'
import { showToast } from '@/lib/toast'
import { Modal } from '@/components/ui/Modal'
import { FormField, Input, Textarea, Select, Button } from '@/components/ui/FormField'
import {
  updateCourseAction,
  createSectionAction,
  deleteSectionAction,
  createLessonAction,
  deleteLessonAction,
  toggleLessonPreviewAction,
} from '@/app/actions/admin-actions'

interface CourseEditorClientProps {
  initialCourse: Course
  initialSections: Section[]
}

export function CourseEditorClient({ initialCourse, initialSections }: CourseEditorClientProps) {
  const [activeTab, setActiveTab] = useState<'curriculum' | 'details' | 'pricing' | 'seo'>('curriculum')
  const [course, setCourse] = useState<Course>(initialCourse)
  const [sections, setSections] = useState<Section[]>(initialSections)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    [initialSections[0]?.id || 'sec-1']: true,
  })

  // Modals state
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false)
  const [newModuleTitle, setNewModuleTitle] = useState('')
  const [newModuleDesc, setNewModuleDesc] = useState('')

  const [isAddLessonOpen, setIsAddLessonOpen] = useState(false)
  const [targetSectionId, setTargetSectionId] = useState<string | null>(null)
  const [newLessonTitle, setNewLessonTitle] = useState('')
  const [newLessonType, setNewLessonType] = useState<'video' | 'text' | 'pdf' | 'quiz'>('video')
  const [newLessonDuration, setNewLessonDuration] = useState(10) // minutes
  const [newLessonFreePreview, setNewLessonFreePreview] = useState(false)

  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'module' | 'lesson'
    id: string
    title: string
    sectionId?: string
  } | null>(null)

  const [isPending, startTransition] = useTransition()

  // Toggle module accordion
  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  // Handle Create Module Form Submission
  const handleCreateModule = () => {
    if (!newModuleTitle.trim()) {
      showToast.error('Validation Error', 'Module title is required.')
      return
    }

    startTransition(async () => {
      const res = await createSectionAction(course.id, newModuleTitle, newModuleDesc)
      if (res.success) {
        const newSec: Section = {
          id: res.data?.id || `sec-${Date.now()}`,
          course_id: course.id,
          title: newModuleTitle,
          description: newModuleDesc,
          sort_order: sections.length + 1,
          lessons: [],
        }
        setSections([...sections, newSec])
        setExpandedSections((prev) => ({ ...prev, [newSec.id]: true }))
        setIsAddModuleOpen(false)
        setNewModuleTitle('')
        setNewModuleDesc('')
        showToast.success('Module Added', `"${newModuleTitle}" was created successfully.`)
      } else {
        showToast.error('Failed to create module', res.error)
      }
    })
  }

  // Handle Create Lesson Form Submission
  const handleCreateLesson = () => {
    if (!newLessonTitle.trim() || !targetSectionId) {
      showToast.error('Validation Error', 'Lesson title is required.')
      return
    }

    const slug = newLessonTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    startTransition(async () => {
      const lessonPayload = {
        title: newLessonTitle,
        slug: `${slug}-${Date.now().toString().slice(-4)}`,
        lesson_type: newLessonType,
        duration_seconds: newLessonDuration * 60,
        is_free_preview: newLessonFreePreview,
      }

      const res = await createLessonAction(targetSectionId, course.id, lessonPayload)
      if (res.success) {
        const newLessonItem: Lesson = {
          id: res.data?.id || `les-${Date.now()}`,
          section_id: targetSectionId,
          course_id: course.id,
          title: newLessonTitle,
          slug: lessonPayload.slug,
          lesson_type: newLessonType,
          content: '',
          video_url: null,
          mux_playback_id: null,
          duration_seconds: newLessonDuration * 60,
          is_free_preview: newLessonFreePreview,
          sort_order: (sections.find((s) => s.id === targetSectionId)?.lessons?.length || 0) + 1,
        }

        setSections((prev) =>
          prev.map((s) => (s.id === targetSectionId ? { ...s, lessons: [...(s.lessons || []), newLessonItem] } : s))
        )
        setIsAddLessonOpen(false)
        setNewLessonTitle('')
        showToast.success('Lesson Added', `"${newLessonTitle}" added to curriculum.`)
      } else {
        showToast.error('Failed to add lesson', res.error)
      }
    })
  }

  // Handle Free Preview Toggle
  const handleTogglePreview = (sectionId: string, lessonId: string, currentState: boolean) => {
    const newState = !currentState
    // Optimistic UI update
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              lessons: (s.lessons || []).map((l) =>
                l.id === lessonId ? { ...l, is_free_preview: newState } : l
              ),
            }
          : s
      )
    )

    startTransition(async () => {
      const res = await toggleLessonPreviewAction(lessonId, newState)
      if (res.success) {
        showToast.info(
          newState ? 'Free Preview Enabled' : 'Lesson Locked',
          newState ? 'Students can watch without purchasing.' : 'Course enrollment required to access.'
        )
      } else {
        showToast.error('Failed to toggle preview status', res.error)
      }
    })
  }

  // Handle Delete Confirmation Execution
  const executeDelete = () => {
    if (!deleteConfirm) return

    startTransition(async () => {
      if (deleteConfirm.type === 'module') {
        const res = await deleteSectionAction(deleteConfirm.id)
        if (res.success) {
          setSections((prev) => prev.filter((s) => s.id !== deleteConfirm.id))
          showToast.success('Module Removed', `"${deleteConfirm.title}" was deleted.`)
        } else {
          showToast.error('Failed to delete module', res.error)
        }
      } else if (deleteConfirm.type === 'lesson' && deleteConfirm.sectionId) {
        const res = await deleteLessonAction(deleteConfirm.id)
        if (res.success) {
          setSections((prev) =>
            prev.map((s) =>
              s.id === deleteConfirm.sectionId
                ? { ...s, lessons: (s.lessons || []).filter((l) => l.id !== deleteConfirm.id) }
                : s
            )
          )
          showToast.success('Lesson Deleted', `"${deleteConfirm.title}" removed.`)
        } else {
          showToast.error('Failed to delete lesson', res.error)
        }
      }
      setDeleteConfirm(null)
    })
  }

  // Handle Full Course Details & Pricing Save
  const handleSaveCourse = () => {
    startTransition(async () => {
      const res = await updateCourseAction(course.id, {
        title: course.title,
        slug: course.slug,
        summary: course.summary || '',
        description: course.description || '',
        category_id: course.category_id || null,
        level: course.level,
        price: Number(course.price),
        currency: course.currency || 'USD',
        status: course.status,
        thumbnail_url: course.thumbnail_url || null,
        seo_title: course.seo_title || null,
        seo_description: course.seo_description || null,
      })

      if (res.success) {
        showToast.success(
          'Course Saved Successfully',
          `"${course.title}" status is set to ${course.status.toUpperCase()}.`
        )
      } else {
        showToast.error('Save Failed', res.error || 'Could not update course.')
      }
    })
  }

  const totalLessons = sections.reduce((acc, s) => acc + (s.lessons?.length || 0), 0)
  const totalDuration = sections.reduce(
    (acc, s) => acc + (s.lessons?.reduce((lAcc, l) => lAcc + l.duration_seconds, 0) || 0),
    0
  )

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Top Breadcrumb & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/courses"
            className="rounded-xl border border-slate-800 bg-slate-900/80 p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white line-clamp-1">
                {course.title}
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  course.status === 'published'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}
              >
                {course.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Slug: <code className="text-slate-300 font-mono">/courses/{course.slug}</code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/courses/${course.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-800/80 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Public View</span>
          </Link>

          <Button
            onClick={handleSaveCourse}
            isLoading={isPending}
            variant="primary"
            size="md"
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </Button>
        </div>
      </div>

      {/* Course Summary Pill Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-2xl border border-slate-800 bg-[#0e1424] p-4 text-xs">
        <div>
          <span className="text-slate-400">Total Modules:</span>
          <div className="text-sm font-bold text-white mt-0.5">{sections.length}</div>
        </div>
        <div>
          <span className="text-slate-400">Total Lessons:</span>
          <div className="text-sm font-bold text-white mt-0.5">{totalLessons}</div>
        </div>
        <div>
          <span className="text-slate-400">Total Duration:</span>
          <div className="text-sm font-bold text-white mt-0.5">{formatDuration(totalDuration)}</div>
        </div>
        <div>
          <span className="text-slate-400">Price:</span>
          <div className="text-sm font-bold text-emerald-400 mt-0.5">
            {formatCurrency(course.price, course.currency)}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-800 space-x-1 sm:space-x-4 overflow-x-auto">
        {[
          { id: 'curriculum', label: 'Curriculum & Lessons', count: totalLessons },
          { id: 'details', label: 'Course Details & Summary' },
          { id: 'pricing', label: 'Pricing & Status' },
          { id: 'seo', label: 'SEO & Metadata' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab 1: Curriculum & Lessons */}
      {activeTab === 'curriculum' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Course Modules & Lessons</h2>
              <p className="text-xs text-slate-400">
                Organize chapters, video & text lessons, and configure free preview access.
              </p>
            </div>
            <Button
              onClick={() => setIsAddModuleOpen(true)}
              variant="secondary"
              size="sm"
            >
              <Plus className="h-3.5 w-3.5 text-blue-400" />
              <span>Add Module</span>
            </Button>
          </div>

          <div className="space-y-4">
            {sections.map((section, sIndex) => {
              const isExpanded = expandedSections[section.id] ?? true
              const lessons = section.lessons || []

              return (
                <div
                  key={section.id}
                  className="rounded-2xl border border-slate-800 bg-[#0e1424] overflow-hidden shadow-sm transition-all"
                >
                  {/* Module Header */}
                  <div className="flex items-center justify-between p-4 bg-slate-900/60 border-b border-slate-800/80">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <GripVertical className="h-4 w-4 text-slate-600 shrink-0" />
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="flex items-center gap-2 text-left truncate"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                        )}
                        <span className="text-xs font-bold text-white uppercase tracking-wider shrink-0">
                          Module {sIndex + 1}:
                        </span>
                        <span className="text-sm font-semibold text-slate-200 truncate">
                          {section.title}
                        </span>
                      </button>
                      <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-400 shrink-0">
                        {lessons.length} {lessons.length === 1 ? 'lesson' : 'lessons'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setTargetSectionId(section.id)
                          setIsAddLessonOpen(true)
                        }}
                        className="inline-flex items-center gap-1 rounded-lg bg-blue-600/15 text-blue-400 px-2.5 py-1 text-xs font-semibold hover:bg-blue-600/30 transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add Lesson</span>
                      </button>

                      <button
                        onClick={() =>
                          setDeleteConfirm({
                            type: 'module',
                            id: section.id,
                            title: section.title,
                          })
                        }
                        className="rounded-lg p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title="Delete Module"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Lessons List in Module */}
                  {isExpanded && (
                    <div className="p-4 space-y-2.5">
                      {lessons.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-800 p-6 text-center text-xs text-slate-500">
                          No lessons in this module yet. Click "+ Add Lesson" to build your curriculum.
                        </div>
                      ) : (
                        lessons.map((lesson, lIndex) => (
                          <div
                            key={lesson.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-800/80 bg-slate-900/40 p-3 hover:border-slate-700/80 transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <GripVertical className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-slate-300 text-xs font-bold shrink-0">
                                {lIndex + 1}
                              </div>
                              <div className="flex items-center gap-2 text-slate-400 shrink-0">
                                {lesson.lesson_type === 'video' ? (
                                  <Video className="h-4 w-4 text-blue-400" />
                                ) : (
                                  <FileText className="h-4 w-4 text-emerald-400" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <span className="text-xs font-semibold text-white block truncate">
                                  {lesson.title}
                                </span>
                                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                                  <span>{formatDuration(lesson.duration_seconds)}</span>
                                  <span>•</span>
                                  <span className="capitalize">{lesson.lesson_type}</span>
                                </div>
                              </div>
                            </div>

                            {/* Free Preview Toggle & Action Buttons */}
                            <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                              <button
                                onClick={() =>
                                  handleTogglePreview(section.id, lesson.id, lesson.is_free_preview)
                                }
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                                  lesson.is_free_preview
                                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                                    : 'bg-slate-800 text-slate-400 hover:text-slate-300 border border-slate-700/60'
                                }`}
                                title="Toggle Free Preview for students before purchasing"
                              >
                                {lesson.is_free_preview ? (
                                  <>
                                    <Unlock className="h-3 w-3 text-emerald-400" />
                                    <span>Free Preview</span>
                                  </>
                                ) : (
                                  <>
                                    <Lock className="h-3 w-3" />
                                    <span>Locked</span>
                                  </>
                                )}
                              </button>

                              <button
                                onClick={() =>
                                  setDeleteConfirm({
                                    type: 'lesson',
                                    id: lesson.id,
                                    title: lesson.title,
                                    sectionId: section.id,
                                  })
                                }
                                className="rounded-lg p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                                title="Delete lesson"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Course Details */}
      {activeTab === 'details' && (
        <div className="space-y-6 max-w-4xl">
          <div className="rounded-2xl border border-slate-800 bg-[#0e1424] p-6 space-y-5">
            <h2 className="text-base font-bold text-white">General Information</h2>

            <div className="space-y-4">
              <FormField label="Course Title" required>
                <Input
                  value={course.title}
                  onChange={(e) => setCourse({ ...course, title: e.target.value })}
                />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="URL Slug" required hint="Must be unique">
                  <Input
                    value={course.slug}
                    onChange={(e) => setCourse({ ...course, slug: e.target.value })}
                  />
                </FormField>
                <FormField label="Experience Level">
                  <Select
                    value={course.level}
                    onChange={(e) => setCourse({ ...course, level: e.target.value as any })}
                  >
                    <option value="all">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </Select>
                </FormField>
              </div>

              <FormField label="Elevator Summary" hint="Appears on course cards">
                <Textarea
                  rows={2}
                  value={course.summary || ''}
                  onChange={(e) => setCourse({ ...course, summary: e.target.value })}
                />
              </FormField>

              <FormField label="Full Description / Syllabus">
                <Textarea
                  rows={6}
                  value={course.description || ''}
                  onChange={(e) => setCourse({ ...course, description: e.target.value })}
                />
              </FormField>

              <FormField label="Cover Image URL">
                <Input
                  value={course.thumbnail_url || ''}
                  onChange={(e) => setCourse({ ...course, thumbnail_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                />
              </FormField>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Pricing */}
      {activeTab === 'pricing' && (
        <div className="space-y-6 max-w-4xl">
          <div className="rounded-2xl border border-slate-800 bg-[#0e1424] p-6 space-y-5">
            <h2 className="text-base font-bold text-white">Enrollment Fee & Publishing</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Course Price ($)" required>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="number"
                    step="0.01"
                    className="pl-10"
                    value={course.price}
                    onChange={(e) => setCourse({ ...course, price: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </FormField>

              <FormField label="Publishing Status">
                <Select
                  value={course.status}
                  onChange={(e) => setCourse({ ...course, status: e.target.value as any })}
                >
                  <option value="draft">Draft (Private to Admins)</option>
                  <option value="published">Published (Live in Catalog)</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="archived">Archived</option>
                </Select>
              </FormField>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: SEO */}
      {activeTab === 'seo' && (
        <div className="space-y-6 max-w-4xl">
          <div className="rounded-2xl border border-slate-800 bg-[#0e1424] p-6 space-y-5">
            <h2 className="text-base font-bold text-white">Search Engine Optimization (SEO)</h2>

            <div className="space-y-4">
              <FormField label="SEO Title">
                <Input
                  value={course.seo_title || ''}
                  onChange={(e) => setCourse({ ...course, seo_title: e.target.value })}
                />
              </FormField>

              <FormField label="SEO Meta Description">
                <Textarea
                  rows={3}
                  value={course.seo_description || ''}
                  onChange={(e) => setCourse({ ...course, seo_description: e.target.value })}
                />
              </FormField>

              {/* Live Google Search Preview */}
              <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Search Result Preview
                </span>
                <div className="mt-2 space-y-1">
                  <div className="text-blue-400 font-medium text-sm hover:underline cursor-pointer">
                    {course.seo_title || course.title}
                  </div>
                  <div className="text-emerald-400 text-xs font-mono">
                    https://fieldnotes.academy/courses/{course.slug}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {course.seo_description || course.summary || 'Enroll now and master new skills.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: Add Module */}
      <Modal
        isOpen={isAddModuleOpen}
        onClose={() => setIsAddModuleOpen(false)}
        title="Add Curriculum Module"
        description="Create a new chapter or module to group related lessons."
      >
        <div className="space-y-4">
          <FormField label="Module Title" required>
            <Input
              placeholder="e.g. Module 3: Authentication & Security"
              value={newModuleTitle}
              onChange={(e) => setNewModuleTitle(e.target.value)}
              autoFocus
            />
          </FormField>
          <FormField label="Summary & Learning Goals">
            <Textarea
              rows={3}
              placeholder="Brief description of what students will achieve in this module..."
              value={newModuleDesc}
              onChange={(e) => setNewModuleDesc(e.target.value)}
            />
          </FormField>
          <div className="flex justify-end gap-3 pt-3">
            <Button
              variant="secondary"
              onClick={() => setIsAddModuleOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateModule}
              isLoading={isPending}
            >
              Create Module
            </Button>
          </div>
        </div>
      </Modal>

      {/* MODAL 2: Add Lesson */}
      <Modal
        isOpen={isAddLessonOpen}
        onClose={() => setIsAddLessonOpen(false)}
        title="Add New Lesson"
        description="Add a video lecture or text guide to this curriculum module."
      >
        <div className="space-y-4">
          <FormField label="Lesson Title" required>
            <Input
              placeholder="e.g. Implementing Session Tokens & Middleware"
              value={newLessonTitle}
              onChange={(e) => setNewLessonTitle(e.target.value)}
              autoFocus
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Lesson Format">
              <Select
                value={newLessonType}
                onChange={(e) => setNewLessonType(e.target.value as any)}
              >
                <option value="video">Video Lesson</option>
                <option value="text">Rich Text / Guide</option>
                <option value="pdf">PDF / Download</option>
                <option value="quiz">Interactive Quiz</option>
              </Select>
            </FormField>

            <FormField label="Estimated Minutes">
              <Input
                type="number"
                min="1"
                value={newLessonDuration}
                onChange={(e) => setNewLessonDuration(parseInt(e.target.value) || 10)}
              />
            </FormField>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="freePreview"
              checked={newLessonFreePreview}
              onChange={(e) => setNewLessonFreePreview(e.target.checked)}
              className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="freePreview" className="text-xs text-slate-300 font-medium cursor-pointer">
              Allow non-enrolled students to watch as a Free Preview
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button
              variant="secondary"
              onClick={() => setIsAddLessonOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateLesson}
              isLoading={isPending}
            >
              Add Lesson
            </Button>
          </div>
        </div>
      </Modal>

      {/* MODAL 3: Delete Confirmation */}
      <Modal
        isOpen={Boolean(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
        title={`Confirm Delete ${deleteConfirm?.type === 'module' ? 'Module' : 'Lesson'}`}
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl bg-rose-500/10 p-3 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <p className="text-xs leading-relaxed">
              Are you sure you want to delete <span className="font-bold">"{deleteConfirm?.title}"</span>? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setDeleteConfirm(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={executeDelete}
              isLoading={isPending}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
