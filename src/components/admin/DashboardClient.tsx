'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  LayoutDashboard,
  BookOpen,
  FolderTree,
  Video,
  FolderArchive,
  Tags,
  Users,
  Ticket,
  TrendingUp,
  Star,
  FileText,
  PenTool,
  UserCheck,
  Quote,
  Image as ImageIcon,
  Settings,
  ExternalLink,
  GraduationCap,
  Sparkles,
  Search,
  Plus,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Layers,
  Upload,
  Database,
  Sliders,
  ShieldCheck,
  X,
  PlayCircle,
  Clock,
  Activity,
  FileSpreadsheet,
  ChevronRight,
} from 'lucide-react'

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
  counts: {
    courses: number
    sections: number
    lessons: number
    courseResources: number
    categories: number
    users: number
    enrollments: number
    lessonProgress: number
    reviews: number
    pages: number
    posts: number
    instructors: number
    testimonials: number
    media: number
  }
}

type CollectionCategory = 'all' | 'academic' | 'community' | 'content' | 'system'

type CollectionCardDef = {
  slug: string
  title: string
  singular: string
  category: CollectionCategory
  categoryLabel: string
  description: string
  countKey?: keyof DashboardData['counts']
  countLabel: string
  isGlobal?: boolean
  browsePath: string
  createPath?: string
  keywords: string[]
  icon: React.ComponentType<{ className?: string }>
  iconBg: string
  iconBorder: string
  iconColor: string
}

export function DashboardClient({ data }: { data: DashboardData }) {
  const [isSkeleton, setIsSkeleton] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<CollectionCategory>('all')

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

  // Master definition of all 14 Collections + 1 Global in Payload with Lucide Icons
  const collectionsList: CollectionCardDef[] = useMemo(
    () => [
      // 1. Academic & LMS
      {
        slug: 'courses',
        title: 'Courses',
        singular: 'Course',
        category: 'academic',
        categoryLabel: 'Curriculum',
        description: 'Master courses, syllabus tracks, pricing tiers, and public publication status.',
        countKey: 'courses',
        countLabel: 'courses',
        browsePath: '/admin/collections/courses',
        createPath: '/admin/collections/courses/create',
        keywords: ['course', 'curriculum', 'syllabus', 'track', 'pricing', 'education'],
        icon: BookOpen,
        iconBg: 'bg-indigo-50 dark:bg-indigo-950/40',
        iconBorder: 'border-indigo-100 dark:border-indigo-900',
        iconColor: 'text-indigo-600 dark:text-indigo-400',
      },
      {
        slug: 'sections',
        title: 'Sections',
        singular: 'Section',
        category: 'academic',
        categoryLabel: 'Curriculum',
        description: 'Module chapters, organized study units, and sequential ordering within courses.',
        countKey: 'sections',
        countLabel: 'sections',
        browsePath: '/admin/collections/sections',
        createPath: '/admin/collections/sections/create',
        keywords: ['section', 'module', 'chapter', 'order', 'curriculum'],
        icon: FolderTree,
        iconBg: 'bg-sky-50 dark:bg-sky-950/40',
        iconBorder: 'border-sky-100 dark:border-sky-900',
        iconColor: 'text-sky-600 dark:text-sky-400',
      },
      {
        slug: 'lessons',
        title: 'Lessons',
        singular: 'Lesson',
        category: 'academic',
        categoryLabel: 'Curriculum',
        description: 'Video streaming modules via Mux, markdown lecture notes, and downloadable assets.',
        countKey: 'lessons',
        countLabel: 'lessons',
        browsePath: '/admin/collections/lessons',
        createPath: '/admin/collections/lessons/create',
        keywords: ['lesson', 'video', 'mux', 'stream', 'lecture', 'quiz'],
        icon: Video,
        iconBg: 'bg-emerald-50 dark:bg-emerald-950/40',
        iconBorder: 'border-emerald-100 dark:border-emerald-900',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
      },
      {
        slug: 'course-resources',
        title: 'Course Resources',
        singular: 'Resource',
        category: 'academic',
        categoryLabel: 'Downloads',
        description: 'Downloadable student slide decks, project source code, cheat-sheets, and PDF files.',
        countKey: 'courseResources',
        countLabel: 'resources',
        browsePath: '/admin/collections/course-resources',
        createPath: '/admin/collections/course-resources/create',
        keywords: ['resource', 'download', 'pdf', 'file', 'archive', 'code', 'zip'],
        icon: FolderArchive,
        iconBg: 'bg-purple-50 dark:bg-purple-950/40',
        iconBorder: 'border-purple-100 dark:border-purple-900',
        iconColor: 'text-purple-600 dark:text-purple-400',
      },
      {
        slug: 'categories',
        title: 'Categories',
        singular: 'Category',
        category: 'academic',
        categoryLabel: 'Taxonomy',
        description: 'Discipline topics, career skill tracks, and course catalog discovery tags.',
        countKey: 'categories',
        countLabel: 'categories',
        browsePath: '/admin/collections/categories',
        createPath: '/admin/collections/categories/create',
        keywords: ['category', 'topic', 'tag', 'taxonomy', 'classification'],
        icon: Tags,
        iconBg: 'bg-amber-50 dark:bg-amber-950/40',
        iconBorder: 'border-amber-100 dark:border-amber-900',
        iconColor: 'text-amber-600 dark:text-amber-400',
      },

      // 2. Learners & Community
      {
        slug: 'users',
        title: 'Users & Staff',
        singular: 'User',
        category: 'community',
        categoryLabel: 'Accounts',
        description: 'Student members, instructors, staff admins, and security permission credentials.',
        countKey: 'users',
        countLabel: 'users',
        browsePath: '/admin/collections/users',
        createPath: '/admin/collections/users/create',
        keywords: ['user', 'student', 'admin', 'instructor', 'account', 'role'],
        icon: Users,
        iconBg: 'bg-blue-50 dark:bg-blue-950/40',
        iconBorder: 'border-blue-100 dark:border-blue-900',
        iconColor: 'text-blue-600 dark:text-blue-400',
      },
      {
        slug: 'enrollments',
        title: 'Enrollments',
        singular: 'Enrollment',
        category: 'community',
        categoryLabel: 'Access',
        description: 'Student registrations, active access permissions, Stripe receipts, and course grants.',
        countKey: 'enrollments',
        countLabel: 'enrollments',
        browsePath: '/admin/collections/enrollments',
        createPath: '/admin/collections/enrollments/create',
        keywords: ['enrollment', 'registration', 'payment', 'stripe', 'student', 'access'],
        icon: Ticket,
        iconBg: 'bg-emerald-50 dark:bg-emerald-950/40',
        iconBorder: 'border-emerald-100 dark:border-emerald-900',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
      },
      {
        slug: 'lesson-progress',
        title: 'Lesson Progress',
        singular: 'Progress Record',
        category: 'community',
        categoryLabel: 'Telemetry',
        description: 'Granular telemetry tracking video watch-time, completed modules, and completions.',
        countKey: 'lessonProgress',
        countLabel: 'records',
        browsePath: '/admin/collections/lesson-progress',
        keywords: ['progress', 'completion', 'video', 'watch', 'telemetry', 'analytics'],
        icon: TrendingUp,
        iconBg: 'bg-teal-50 dark:bg-teal-950/40',
        iconBorder: 'border-teal-100 dark:border-teal-900',
        iconColor: 'text-teal-600 dark:text-teal-400',
      },
      {
        slug: 'reviews',
        title: 'Course Reviews',
        singular: 'Review',
        category: 'community',
        categoryLabel: 'Moderation',
        description: 'Student star ratings, written commentary, feedback moderation queue, and approvals.',
        countKey: 'reviews',
        countLabel: 'reviews',
        browsePath: '/admin/collections/reviews',
        createPath: '/admin/collections/reviews/create',
        keywords: ['review', 'rating', 'star', 'feedback', 'comment', 'moderation', 'approval'],
        icon: Star,
        iconBg: 'bg-amber-50 dark:bg-amber-950/40',
        iconBorder: 'border-amber-100 dark:border-amber-900',
        iconColor: 'text-amber-600 dark:text-amber-400',
      },

      // 3. Editorial & Marketing
      {
        slug: 'pages',
        title: 'Pages',
        singular: 'Page',
        category: 'content',
        categoryLabel: 'Editorial',
        description: 'Custom landing pages, about page, curriculum overviews, and policy legal documents.',
        countKey: 'pages',
        countLabel: 'pages',
        browsePath: '/admin/collections/pages',
        createPath: '/admin/collections/pages/create',
        keywords: ['page', 'landing', 'legal', 'privacy', 'about', 'static'],
        icon: FileText,
        iconBg: 'bg-slate-100 dark:bg-zinc-800',
        iconBorder: 'border-slate-200 dark:border-zinc-700',
        iconColor: 'text-slate-700 dark:text-slate-300',
      },
      {
        slug: 'posts',
        title: 'Journal Posts',
        singular: 'Post',
        category: 'content',
        categoryLabel: 'Editorial',
        description: 'Studio publications, technical tutorials, platform announcements, and blog articles.',
        countKey: 'posts',
        countLabel: 'posts',
        browsePath: '/admin/collections/posts',
        createPath: '/admin/collections/posts/create',
        keywords: ['post', 'article', 'blog', 'journal', 'news', 'tutorial'],
        icon: PenTool,
        iconBg: 'bg-rose-50 dark:bg-rose-950/40',
        iconBorder: 'border-rose-100 dark:border-rose-900',
        iconColor: 'text-rose-600 dark:text-rose-400',
      },
      {
        slug: 'instructors',
        title: 'Faculty Instructors',
        singular: 'Instructor',
        category: 'content',
        categoryLabel: 'Faculty',
        description: 'Faculty profiles, instructor biographies, social handles, and assigned course leads.',
        countKey: 'instructors',
        countLabel: 'instructors',
        browsePath: '/admin/collections/instructors',
        createPath: '/admin/collections/instructors/create',
        keywords: ['instructor', 'faculty', 'teacher', 'author', 'bio', 'profile'],
        icon: UserCheck,
        iconBg: 'bg-violet-50 dark:bg-violet-950/40',
        iconBorder: 'border-violet-100 dark:border-violet-900',
        iconColor: 'text-violet-600 dark:text-violet-400',
      },
      {
        slug: 'testimonials',
        title: 'Testimonials',
        singular: 'Testimonial',
        category: 'content',
        categoryLabel: 'Marketing',
        description: 'Curated student testimonials, company endorsement quotes, and homepage social proof.',
        countKey: 'testimonials',
        countLabel: 'quotes',
        browsePath: '/admin/collections/testimonials',
        createPath: '/admin/collections/testimonials/create',
        keywords: ['testimonial', 'quote', 'social proof', 'endorsement', 'student'],
        icon: Quote,
        iconBg: 'bg-teal-50 dark:bg-teal-950/40',
        iconBorder: 'border-teal-100 dark:border-teal-900',
        iconColor: 'text-teal-600 dark:text-teal-400',
      },

      // 4. System & Storage
      {
        slug: 'media',
        title: 'Media Storage',
        singular: 'Asset',
        category: 'system',
        categoryLabel: 'Supabase S3',
        description: 'Uploaded course banners, video thumbnails, avatars, graphics, and cloud attachments.',
        countKey: 'media',
        countLabel: 'assets',
        browsePath: '/admin/collections/media',
        createPath: '/admin/collections/media/create',
        keywords: ['media', 'image', 'upload', 's3', 'storage', 'supabase', 'photo', 'file'],
        icon: ImageIcon,
        iconBg: 'bg-rose-50 dark:bg-rose-950/40',
        iconBorder: 'border-rose-100 dark:border-rose-900',
        iconColor: 'text-rose-600 dark:text-rose-400',
      },
      {
        slug: 'site-settings',
        title: 'Global Settings',
        singular: 'Global',
        category: 'system',
        categoryLabel: 'Global Config',
        description: 'Platform site title, SEO metadata, navigation menus, social links, and branding parameters.',
        isGlobal: true,
        countLabel: 'singleton',
        browsePath: '/admin/globals/site-settings',
        keywords: ['setting', 'global', 'config', 'seo', 'navigation', 'brand', 'social'],
        icon: Settings,
        iconBg: 'bg-zinc-100 dark:bg-zinc-800',
        iconBorder: 'border-zinc-200 dark:border-zinc-700',
        iconColor: 'text-zinc-700 dark:text-zinc-300',
      },
    ],
    [],
  )

  // Filter collections by search query and category
  const filteredCollections = useMemo(() => {
    return collectionsList.filter((col) => {
      const matchesCategory = selectedCategory === 'all' || col.category === selectedCategory
      if (!matchesCategory) return false

      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase().trim()
      return (
        col.title.toLowerCase().includes(q) ||
        col.slug.toLowerCase().includes(q) ||
        col.description.toLowerCase().includes(q) ||
        col.keywords.some((k) => k.toLowerCase().includes(q))
      )
    })
  }, [collectionsList, selectedCategory, searchQuery])

  // Category counts
  const categoryCounts = useMemo(() => {
    return {
      all: collectionsList.length,
      academic: collectionsList.filter((c) => c.category === 'academic').length,
      community: collectionsList.filter((c) => c.category === 'community').length,
      content: collectionsList.filter((c) => c.category === 'content').length,
      system: collectionsList.filter((c) => c.category === 'system').length,
    }
  }, [collectionsList])

  return (
    <div className="w-full max-w-7xl mx-auto py-2 px-2 sm:px-4 space-y-6 font-sans">
      {/* Top Utility & Status Bar */}
      <div className="flex flex-wrap items-center justify-between p-3.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-xs gap-3">
        <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulseGlow" />
          <span className="font-bold text-slate-900 dark:text-white tracking-tight">Production Engine</span>
          <span className="text-slate-300 dark:text-zinc-700">•</span>
          <span className="text-slate-400 dark:text-zinc-500 text-[11px]">PostgreSQL Connected</span>
          <span className="text-slate-300 dark:text-zinc-700 hidden sm:inline">•</span>
          <span className="text-slate-400 dark:text-zinc-500 text-[11px] hidden sm:inline">Payload 3.x App Router</span>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-zinc-800/80 px-2.5 py-1 rounded-md border border-slate-200 dark:border-zinc-700">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {currentDate}
          </span>

          {/* Interactive Skeleton Shimmer Toggle with Lucide Sparkles */}
          <button
            type="button"
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
              isSkeleton
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/25 ring-2 ring-indigo-400/30'
                : 'bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800'
            }`}
            onClick={() => setIsSkeleton(!isSkeleton)}
            title="Toggle Skeleton Shimmer Animation Preview"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isSkeleton ? 'animate-spin' : ''}`} />
            <span>{isSkeleton ? 'Live Data View' : 'Skeleton Shimmer'}</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-200 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700/60 transition-all shadow-xs"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-lg text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-all shadow-xs"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student Space</span>
          </Link>
        </div>
      </div>

      {/* Hero Welcome Command Banner */}
      <section className="relative overflow-hidden rounded-2xl p-7 md:p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-950 text-white shadow-xl border border-white/10">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-500/20 via-emerald-500/10 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-indigo-500/30 flex-shrink-0">
              <span>{data.userName.slice(0, 2).toUpperCase()}</span>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Role: {data.userRole}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                  <Layers className="w-3 h-3 text-indigo-400" />
                  Tailwind v3 + Lucide
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-slate-300 border border-white/10">
                  Fieldnotes Admin
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
                  <>Studio command is active. Manage your curriculum, monitor learners, review feedback, and orchestrate all 14 database models from one modern dashboard.</>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="bg-white/5 border border-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl flex flex-col gap-0.5">
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Curriculum</span>
              <span className="text-sm font-bold text-white flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                {data.coursesCount} Courses
              </span>
            </div>
            <div className="bg-white/5 border border-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl flex flex-col gap-0.5">
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Video Stream</span>
              <span className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                100% Ready
              </span>
            </div>
            <div className="bg-white/5 border border-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl flex flex-col gap-0.5">
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Moderation</span>
              <span className="text-sm font-bold text-sky-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-sky-400" />
                {data.pendingReviewsCount > 0 ? `${data.pendingReviewsCount} Pending` : 'Clean Queue'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* KPI Stats Grid with Lucide Icons */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Courses */}
        <Link
          href="/admin/collections/courses"
          className="group relative flex flex-col justify-between p-5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <TrendingUp className="w-3 h-3" />
              <span>{data.publishedCourses} Live</span>
            </span>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Courses</span>
            {isSkeleton ? (
              <div className="w-24 h-9 rounded bg-slate-200 dark:bg-zinc-800 animate-shimmer my-2" />
            ) : (
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight my-1">
                {data.coursesCount}
              </div>
            )}
            <div className="mt-2.5 space-y-1.5">
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
          className="group relative flex flex-col justify-between p-5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400">
              <Ticket className="w-3 h-3" />
              <span>{data.activeEnrollmentsCount} Enrollments</span>
            </span>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Learners</span>
            {isSkeleton ? (
              <div className="w-24 h-9 rounded bg-slate-200 dark:bg-zinc-800 animate-shimmer my-2" />
            ) : (
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight my-1">
                {data.studentsCount}
              </div>
            )}
            <div className="mt-2.5 space-y-1.5">
              <div className="w-full h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '85%' }} />
              </div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {data.activeEnrollmentsCount} active registrations tracked
              </span>
            </div>
          </div>
        </Link>

        {/* Card 3: Video Lessons */}
        <Link
          href="/admin/collections/lessons"
          className="group relative flex flex-col justify-between p-5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-sky-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900 flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
              <PlayCircle className="w-3 h-3" />
              <span>Mux Video</span>
            </span>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Curriculum Modules</span>
            {isSkeleton ? (
              <div className="w-24 h-9 rounded bg-slate-200 dark:bg-zinc-800 animate-shimmer my-2" />
            ) : (
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight my-1">
                {data.lessonsCount}
              </div>
            )}
            <div className="mt-2.5 space-y-1.5">
              <div className="w-full h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-500 rounded-full transition-all duration-500"
                  style={{ width: `${data.lessonsCount > 0 ? (data.videoLessonsCount / data.lessonsCount) * 100 : 100}%` }}
                />
              </div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {data.videoLessonsCount} video streams configured
              </span>
            </div>
          </div>
        </Link>

        {/* Card 4: Reviews & Feedback */}
        <Link
          href="/admin/collections/reviews"
          className="group relative flex flex-col justify-between p-5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900 flex items-center justify-center">
              <Star className="w-5 h-5" />
            </div>
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                data.pendingReviewsCount > 0
                  ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
                  : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
              }`}
            >
              {data.pendingReviewsCount > 0 ? `${data.pendingReviewsCount} Pending` : 'All Approved'}
            </span>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Student Feedback</span>
            {isSkeleton ? (
              <div className="w-24 h-9 rounded bg-slate-200 dark:bg-zinc-800 animate-shimmer my-2" />
            ) : (
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight my-1">
                {data.totalReviewsCount}
              </div>
            )}
            <div className="mt-2.5 space-y-1.5">
              <div className="w-full h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${data.pendingReviewsCount > 0 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: '100%' }}
                />
              </div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {data.pendingReviewsCount > 0
                  ? `${data.pendingReviewsCount} review(s) awaiting moderation`
                  : 'All reviews published live'}
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* Secondary Fast Metrics Bar with Lucide Icons */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          href="/admin/collections/media"
          className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs hover:border-slate-300 dark:hover:border-zinc-700 transition-all"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Media Assets</span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                {isSkeleton ? <span className="inline-block w-8 h-4 rounded bg-slate-200 dark:bg-zinc-800 animate-shimmer" /> : `${data.counts.media} files`}
              </span>
            </div>
          </div>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
        </Link>

        <Link
          href="/admin/collections/posts"
          className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs hover:border-slate-300 dark:hover:border-zinc-700 transition-all"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <PenTool className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Journal Posts</span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                {isSkeleton ? <span className="inline-block w-8 h-4 rounded bg-slate-200 dark:bg-zinc-800 animate-shimmer" /> : `${data.counts.posts} published`}
              </span>
            </div>
          </div>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
        </Link>

        <Link
          href="/admin/collections/instructors"
          className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs hover:border-slate-300 dark:hover:border-zinc-700 transition-all"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Faculty Leads</span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                {isSkeleton ? <span className="inline-block w-8 h-4 rounded bg-slate-200 dark:bg-zinc-800 animate-shimmer" /> : `${data.counts.instructors} leads`}
              </span>
            </div>
          </div>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
        </Link>

        <Link
          href="/admin/collections/course-resources"
          className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs hover:border-slate-300 dark:hover:border-zinc-700 transition-all"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <FolderArchive className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Resources</span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                {isSkeleton ? <span className="inline-block w-8 h-4 rounded bg-slate-200 dark:bg-zinc-800 animate-shimmer" /> : `${data.counts.courseResources} downloads`}
              </span>
            </div>
          </div>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
        </Link>
      </section>

      {/* Quick Action Command Strip */}
      <section className="p-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
            QUICK DISPATCH
          </span>
          <span className="text-[11px] text-slate-400">Direct Creation Shortcuts</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/admin/collections/courses/create"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:bg-indigo-600 hover:border-indigo-600 hover:text-white transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-500 group-hover:text-white" />
            <span>Course</span>
          </Link>
          <Link
            href="/admin/collections/sections/create"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:bg-sky-600 hover:border-sky-600 hover:text-white transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-sky-500 group-hover:text-white" />
            <span>Section</span>
          </Link>
          <Link
            href="/admin/collections/lessons/create"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:bg-emerald-600 hover:border-emerald-600 hover:text-white transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-500 group-hover:text-white" />
            <span>Lesson</span>
          </Link>
          <Link
            href="/admin/collections/posts/create"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:bg-rose-600 hover:border-rose-600 hover:text-white transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-rose-500 group-hover:text-white" />
            <span>Journal Post</span>
          </Link>
          <Link
            href="/admin/collections/pages/create"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:bg-teal-600 hover:border-teal-600 hover:text-white transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-teal-500 group-hover:text-white" />
            <span>Page</span>
          </Link>
          <Link
            href="/admin/collections/media/create"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:bg-rose-600 hover:border-rose-600 hover:text-white transition-all shadow-xs"
          >
            <Upload className="w-3.5 h-3.5 text-rose-500 group-hover:text-white" />
            <span>Upload Media</span>
          </Link>
          <Link
            href="/admin/globals/site-settings"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:bg-amber-600 hover:border-amber-600 hover:text-white transition-all shadow-xs"
          >
            <Settings className="w-3.5 h-3.5 text-amber-500 group-hover:text-white" />
            <span>Settings</span>
          </Link>
        </div>
      </section>

      {/* Two-Column Analytics & Live Feeds */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Recent Activity Feed (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xs flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <h3 className="font-bold text-sm tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                <Ticket className="w-4 h-4 text-indigo-500" />
                Recent Student Enrollments
              </h3>
            </div>
            <Link
              href="/admin/collections/enrollments"
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-4 flex-1">
            {isSkeleton ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 animate-shimmer">
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-zinc-700" />
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
                        <td className="py-2.5 pl-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-100 to-sky-100 text-indigo-700 font-bold flex items-center justify-center text-[10px]">
                              {item.studentName.slice(0, 2).toUpperCase()}
                            </div>
                            <span className="font-semibold text-slate-900 dark:text-white">{item.studentName}</span>
                          </div>
                        </td>
                        <td className="py-2.5 text-slate-600 dark:text-slate-300">
                          <span className="bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded border border-slate-200 dark:border-zinc-700 font-medium">
                            {item.courseTitle}
                          </span>
                        </td>
                        <td className="py-2.5">
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                            {item.source}
                          </span>
                        </td>
                        <td className="py-2.5 pr-2 text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {item.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 px-4">
                <div className="w-11 h-11 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <Ticket className="w-5 h-5 text-slate-400" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">No Recent Enrollments Recorded</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                  Student registrations and new course enrollments will appear here in real time.
                </p>
                <Link
                  href="/admin/collections/enrollments/create"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Enroll Student Manually</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right: Studio Health & Quick Navigation (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xs flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <h3 className="font-bold text-sm tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-500" />
                Curriculum Health
              </h3>
            </div>
            <Link
              href="/admin/collections/reviews"
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              <span>Reviews Queue</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-4 flex-1 space-y-4">
            {/* Moderation Status Banner */}
            {data.pendingReviewsCount > 0 ? (
              <div className="flex gap-3 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-xs text-amber-900 dark:text-amber-200">
                    {data.pendingReviewsCount} Review(s) Awaiting Moderation
                  </h5>
                  <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5 mb-2">
                    Students submitted new course feedback requiring administrator approval.
                  </p>
                  <Link
                    href="/admin/collections/reviews"
                    className="text-[11px] font-bold text-amber-800 dark:text-amber-200 underline flex items-center gap-1"
                  >
                    <span>Review and Approve</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <div>
                  <h5 className="font-bold text-xs text-emerald-900 dark:text-emerald-200">Review Queue Is Clean</h5>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400">All student feedback has been moderated and published live.</p>
                </div>
              </div>
            )}

            {/* Health Metrics Progress Bars */}
            <div className="p-3.5 bg-slate-50 dark:bg-zinc-800/60 rounded-xl border border-slate-200 dark:border-zinc-700/80 space-y-3">
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

            {/* Shortcuts Grid with Lucide Icons */}
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/admin/collections/categories"
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/80 hover:border-indigo-500 hover:bg-white dark:hover:bg-zinc-800 transition-all group"
              >
                <Tags className="w-4 h-4 text-amber-500" />
                <div className="flex-1 min-w-0">
                  <span className="block text-xs font-bold text-slate-900 dark:text-white truncate">Categories</span>
                  <span className="block text-[10px] text-slate-400">Taxonomy</span>
                </div>
                <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 group-hover:text-indigo-600 transition-all" />
              </Link>

              <Link
                href="/admin/collections/instructors"
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/80 hover:border-indigo-500 hover:bg-white dark:hover:bg-zinc-800 transition-all group"
              >
                <UserCheck className="w-4 h-4 text-violet-500" />
                <div className="flex-1 min-w-0">
                  <span className="block text-xs font-bold text-slate-900 dark:text-white truncate">Instructors</span>
                  <span className="block text-[10px] text-slate-400">Faculty</span>
                </div>
                <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 group-hover:text-indigo-600 transition-all" />
              </Link>

              <Link
                href="/admin/collections/course-resources"
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/80 hover:border-indigo-500 hover:bg-white dark:hover:bg-zinc-800 transition-all group"
              >
                <FolderArchive className="w-4 h-4 text-purple-500" />
                <div className="flex-1 min-w-0">
                  <span className="block text-xs font-bold text-slate-900 dark:text-white truncate">Resources</span>
                  <span className="block text-[10px] text-slate-400">Downloads</span>
                </div>
                <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 group-hover:text-indigo-600 transition-all" />
              </Link>

              <Link
                href="/admin/collections/users"
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/80 hover:border-indigo-500 hover:bg-white dark:hover:bg-zinc-800 transition-all group"
              >
                <Users className="w-4 h-4 text-blue-500" />
                <div className="flex-1 min-w-0">
                  <span className="block text-xs font-bold text-slate-900 dark:text-white truncate">Users</span>
                  <span className="block text-[10px] text-slate-400">Security</span>
                </div>
                <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 group-hover:text-indigo-600 transition-all" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          DATABASE ARCHITECTURE & COLLECTIONS HUB (14 MODELS + GLOBALS WITH LUCIDE ICONS)
          ========================================================================== */}
      <section className="space-y-4 pt-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <h2 className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-500" />
                Database Architecture & Collections
              </h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-zinc-700">
                {collectionsList.length} Models
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-400 mt-0.5">
              Browse, search, and manage all collections, relations, and globals powering Fieldnotes.
            </p>
          </div>

          {/* Search Input Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search collections or keywords..."
              className="w-full pl-9 pr-8 py-2 text-xs font-medium bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs p-1"
                title="Clear filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50'
            }`}
          >
            <span>All Models</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              selectedCategory === 'all'
                ? 'bg-white/20 dark:bg-slate-900/20'
                : 'bg-slate-100 dark:bg-zinc-800'
            }`}>
              {categoryCounts.all}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('academic')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'academic'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50'
            }`}
          >
            <span>Academic & LMS</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              selectedCategory === 'academic' ? 'bg-white/20' : 'bg-slate-100 dark:bg-zinc-800'
            }`}>
              {categoryCounts.academic}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('community')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'community'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50'
            }`}
          >
            <span>Learners & Community</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              selectedCategory === 'community' ? 'bg-white/20' : 'bg-slate-100 dark:bg-zinc-800'
            }`}>
              {categoryCounts.community}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('content')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'content'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50'
            }`}
          >
            <span>Editorial & Faculty</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              selectedCategory === 'content' ? 'bg-white/20' : 'bg-slate-100 dark:bg-zinc-800'
            }`}>
              {categoryCounts.content}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('system')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'system'
                ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900 shadow-xs'
                : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50'
            }`}
          >
            <span>System & Media</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              selectedCategory === 'system'
                ? 'bg-white/20 dark:bg-zinc-900/20'
                : 'bg-slate-100 dark:bg-zinc-800'
            }`}>
              {categoryCounts.system}
            </span>
          </button>
        </div>

        {/* Bento Grid of Modern Collection Cards with Lucide Icons */}
        {filteredCollections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCollections.map((col) => {
              const countVal = col.countKey ? data.counts[col.countKey] : undefined
              const IconComponent = col.icon

              return (
                <div
                  key={col.slug}
                  className="group relative flex flex-col justify-between p-5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xs hover:shadow-lg hover:border-slate-300 dark:hover:border-zinc-700 transition-all duration-200"
                >
                  {/* Top Row: Icon + Badges */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className={`w-11 h-11 rounded-xl ${col.iconBg} ${col.iconBorder} ${col.iconColor} border flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                        <IconComponent className="w-5 h-5" />
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap justify-end">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-zinc-700">
                          {col.categoryLabel}
                        </span>

                        {isSkeleton ? (
                          <span className="w-14 h-5 rounded-md bg-slate-200 dark:bg-zinc-800 animate-shimmer" />
                        ) : col.isGlobal ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-900">
                            Global
                          </span>
                        ) : countVal !== undefined ? (
                          <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-slate-900 text-white dark:bg-zinc-800 dark:text-slate-200">
                            {countVal} {col.countLabel}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    {/* Title + Monospace Slug */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {col.title}
                        </h3>
                        <span className="text-[11px] font-mono font-medium text-slate-400 dark:text-zinc-500">
                          /{col.slug}
                        </span>
                      </div>

                      {isSkeleton ? (
                        <div className="space-y-1.5 py-1">
                          <div className="w-full h-3 rounded bg-slate-200 dark:bg-zinc-800 animate-shimmer" />
                          <div className="w-3/4 h-3 rounded bg-slate-200 dark:bg-zinc-800 animate-shimmer" />
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                          {col.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bottom Action Row */}
                  <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between gap-2">
                    {col.createPath ? (
                      <Link
                        href={col.createPath}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5 text-indigo-500" />
                        <span>New {col.singular}</span>
                      </Link>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">Auto-managed</span>
                    )}

                    <Link
                      href={col.browsePath}
                      className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-slate-200 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-all shadow-xs"
                    >
                      <span>{col.isGlobal ? 'Manage' : 'Browse'}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12 px-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6 text-slate-400" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
              No models match "{searchQuery}"
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
              Try searching by collection slug (e.g. "courses", "lessons", "media") or clear the active filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 transition-all"
            >
              Reset Search & Filters
            </button>
          </div>
        )}
      </section>

      {/* Footer Info Strip */}
      <footer className="pt-4 pb-2 border-t border-slate-200 dark:border-zinc-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-600 dark:text-slate-300">Fieldnotes Studio</span>
          <span>•</span>
          <span>Curriculum Command Center</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Payload CMS 3.x</span>
          <span>•</span>
          <span>Tailwind CSS v3</span>
          <span>•</span>
          <span>Lucide Icons</span>
        </div>
      </footer>
    </div>
  )
}

export default DashboardClient
