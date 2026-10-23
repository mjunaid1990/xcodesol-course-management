'use client'

import React, { useState, useMemo } from 'react'
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
  Plus,
  ChevronRight,
  CheckCircle2,
  Database,
  ShieldCheck,
  Search,
  X,
  Server,
  Film,
  HardDrive,
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
  const [selectedCategory, setSelectedCategory] = useState<CollectionCategory>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // All 14 Database Collections + 1 Global Setting
  const collectionsList: CollectionCardDef[] = useMemo(
    () => [
      // 1. Academic & Curriculum
      {
        slug: 'courses',
        title: 'Courses',
        singular: 'Course',
        category: 'academic',
        categoryLabel: 'Curriculum',
        description: 'Primary educational master courses, syllabi, pricing tiers, and instructor assignments.',
        countKey: 'courses',
        countLabel: 'courses',
        browsePath: '/admin/collections/courses',
        createPath: '/admin/collections/courses/create',
        keywords: ['course', 'curriculum', 'syllabus', 'track', 'program', 'class'],
        icon: BookOpen,
        iconBg: 'bg-indigo-50 dark:bg-indigo-950/40',
        iconBorder: 'border-indigo-100 dark:border-indigo-900',
        iconColor: 'text-indigo-600 dark:text-indigo-400',
      },
      {
        slug: 'sections',
        title: 'Curriculum Sections',
        singular: 'Section',
        category: 'academic',
        categoryLabel: 'Structure',
        description: 'Hierarchical course chapters, learning modules, milestones, and topic organization.',
        countKey: 'sections',
        countLabel: 'sections',
        browsePath: '/admin/collections/sections',
        createPath: '/admin/collections/sections/create',
        keywords: ['section', 'chapter', 'module', 'unit', 'part'],
        icon: FolderTree,
        iconBg: 'bg-sky-50 dark:bg-sky-950/40',
        iconBorder: 'border-sky-100 dark:border-sky-900',
        iconColor: 'text-sky-600 dark:text-sky-400',
      },
      {
        slug: 'lessons',
        title: 'Lessons & Video Streams',
        singular: 'Lesson',
        category: 'academic',
        categoryLabel: 'Learning Units',
        description: 'Video lectures, reading materials, Mux playback IDs, durations, and free previews.',
        countKey: 'lessons',
        countLabel: 'lessons',
        browsePath: '/admin/collections/lessons',
        createPath: '/admin/collections/lessons/create',
        keywords: ['lesson', 'video', 'stream', 'lecture', 'mux', 'content'],
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
        description: 'Downloadable student files, GitHub code repositories, PDF cheatsheets, and project archives.',
        countKey: 'courseResources',
        countLabel: 'files',
        browsePath: '/admin/collections/course-resources',
        createPath: '/admin/collections/course-resources/create',
        keywords: ['resource', 'download', 'pdf', 'archive', 'zip', 'attachment'],
        icon: FolderArchive,
        iconBg: 'bg-amber-50 dark:bg-amber-950/40',
        iconBorder: 'border-amber-100 dark:border-amber-900',
        iconColor: 'text-amber-600 dark:text-amber-400',
      },
      {
        slug: 'categories',
        title: 'Categories & Taxonomy',
        singular: 'Category',
        category: 'academic',
        categoryLabel: 'Taxonomy',
        description: 'Course topic taxonomy, subject classification, and catalog browsing tags.',
        countKey: 'categories',
        countLabel: 'categories',
        browsePath: '/admin/collections/categories',
        createPath: '/admin/collections/categories/create',
        keywords: ['category', 'taxonomy', 'topic', 'tag', 'subject'],
        icon: Tags,
        iconBg: 'bg-purple-50 dark:bg-purple-950/40',
        iconBorder: 'border-purple-100 dark:border-purple-900',
        iconColor: 'text-purple-600 dark:text-purple-400',
      },

      // 2. Learners & Community
      {
        slug: 'users',
        title: 'Users & Staff',
        singular: 'User',
        category: 'community',
        categoryLabel: 'Accounts',
        description: 'Platform administrators, course instructors, teaching assistants, and registered students.',
        countKey: 'users',
        countLabel: 'accounts',
        browsePath: '/admin/collections/users',
        createPath: '/admin/collections/users/create',
        keywords: ['user', 'account', 'student', 'admin', 'instructor', 'member'],
        icon: Users,
        iconBg: 'bg-emerald-50 dark:bg-emerald-950/40',
        iconBorder: 'border-emerald-100 dark:border-emerald-900',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
      },
      {
        slug: 'enrollments',
        title: 'Student Enrollments',
        singular: 'Enrollment',
        category: 'community',
        categoryLabel: 'Access Pass',
        description: 'Active course enrollments, Stripe checkout orders, manual grants, and student access logs.',
        countKey: 'enrollments',
        countLabel: 'enrollments',
        browsePath: '/admin/collections/enrollments',
        createPath: '/admin/collections/enrollments/create',
        keywords: ['enrollment', 'student', 'order', 'purchase', 'access', 'stripe'],
        icon: Ticket,
        iconBg: 'bg-blue-50 dark:bg-blue-950/40',
        iconBorder: 'border-blue-100 dark:border-blue-900',
        iconColor: 'text-blue-600 dark:text-blue-400',
      },
      {
        slug: 'lesson-progress',
        title: 'Lesson Progress Tracking',
        singular: 'Progress',
        category: 'community',
        categoryLabel: 'Analytics',
        description: 'Per-student completion status, watch-time timestamps, and curriculum completion metrics.',
        countKey: 'lessonProgress',
        countLabel: 'records',
        browsePath: '/admin/collections/lesson-progress',
        keywords: ['progress', 'completion', 'watchtime', 'analytics', 'student'],
        icon: TrendingUp,
        iconBg: 'bg-cyan-50 dark:bg-cyan-950/40',
        iconBorder: 'border-cyan-100 dark:border-cyan-900',
        iconColor: 'text-cyan-600 dark:text-cyan-400',
      },
      {
        slug: 'reviews',
        title: 'Course Reviews & Ratings',
        singular: 'Review',
        category: 'community',
        categoryLabel: 'Moderation',
        description: 'Student course reviews, star ratings, editorial moderation approvals, and public feedback.',
        countKey: 'reviews',
        countLabel: 'reviews',
        browsePath: '/admin/collections/reviews',
        createPath: '/admin/collections/reviews/create',
        keywords: ['review', 'rating', 'feedback', 'moderation', 'testimonial', 'star'],
        icon: Star,
        iconBg: 'bg-amber-50 dark:bg-amber-950/40',
        iconBorder: 'border-amber-100 dark:border-amber-900',
        iconColor: 'text-amber-600 dark:text-amber-400',
      },

      // 3. Editorial & Marketing
      {
        slug: 'pages',
        title: 'Content Pages',
        singular: 'Page',
        category: 'content',
        categoryLabel: 'CMS Pages',
        description: 'Landing pages, privacy policies, terms of service, custom routes, and rich layout blocks.',
        countKey: 'pages',
        countLabel: 'pages',
        browsePath: '/admin/collections/pages',
        createPath: '/admin/collections/pages/create',
        keywords: ['page', 'landing', 'content', 'marketing', 'cms'],
        icon: FileText,
        iconBg: 'bg-indigo-50 dark:bg-indigo-950/40',
        iconBorder: 'border-indigo-100 dark:border-indigo-900',
        iconColor: 'text-indigo-600 dark:text-indigo-400',
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
    <div className="w-full max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-8 space-y-9 font-sans">
      {/* 1. Executive Hero Banner (Cleaned up, no dev noise or duplicate links) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-7 sm:p-9 shadow-lg border border-slate-800/80">
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-96 h-96 bg-gradient-to-br from-indigo-500/20 via-sky-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Role: {data.userRole}
              </span>
              <span className="text-slate-300 text-xs font-semibold">
                Fieldnotes Studio Command
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Welcome back, {data.userName}.
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Studio command is active. Manage your curriculum, monitor learners, review feedback, and orchestrate all 14 database models from one modern dashboard.
            </p>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 flex-wrap self-start md:self-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center min-w-[115px]">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Curriculum
              </span>
              <span className="text-xl font-extrabold text-white mt-1 block">
                {data.coursesCount} Courses
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center min-w-[115px]">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Video Stream
              </span>
              <span className="text-xl font-extrabold text-emerald-400 mt-1 block">
                100% Ready
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center min-w-[115px]">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Moderation
              </span>
              <span className="text-xl font-extrabold text-cyan-300 mt-1 block">
                {data.pendingReviewsCount > 0 ? `${data.pendingReviewsCount} Pending` : 'Clean Queue'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Primary KPI Metrics Row (4 Cards, scaled fonts +15%) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {/* Card 1: Courses */}
        <Link
          href="/admin/collections/courses"
          className="group relative p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-800 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-2xs">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-[12px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                {data.publishedCourses} Live
              </span>
            </div>

            <h3 className="text-[13px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
              Total Courses
            </h3>

            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {data.coursesCount}
              </span>
            </div>

            <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden mb-3.5">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{
                  width: data.coursesCount > 0 ? `${Math.round((data.publishedCourses / data.coursesCount) * 100)}%` : '0%',
                }}
              />
            </div>
          </div>

          <p className="text-[13.5px] font-medium text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>{data.publishedCourses} published • {data.draftCourses} drafts</span>
            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-indigo-600" />
          </p>
        </Link>

        {/* Card 2: Learners */}
        <Link
          href="/admin/collections/users"
          className="group relative p-5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xs hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-800 transition-all"
        >
          <div className="flex items-center justify-between mb-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[12px] font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 px-2.5 py-0.5 rounded-full border border-sky-200 dark:border-sky-800">
              {data.activeEnrollmentsCount} Enrollments
            </span>
          </div>

          <h3 className="text-[13px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1">
            Active Learners
          </h3>

          <div className="flex items-baseline gap-2 mb-2.5">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {data.studentsCount}
            </span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden mb-2.5">
            <div className="bg-emerald-500 h-full rounded-full w-full" />
          </div>

          <p className="text-[13.5px] font-medium text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>{data.activeEnrollmentsCount} active registrations tracked</span>
            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-emerald-600" />
          </p>
        </Link>

        {/* Card 3: Curriculum Modules */}
        <Link
          href="/admin/collections/lessons"
          className="group relative p-5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xs hover:shadow-md hover:border-sky-300 dark:hover:border-sky-800 transition-all"
        >
          <div className="flex items-center justify-between mb-3.5">
            <div className="w-11 h-11 rounded-xl bg-sky-50 dark:bg-sky-950/50 border border-sky-100 dark:border-sky-900 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <Video className="w-5 h-5" />
            </div>
            <span className="text-[12px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
              Mux Video
            </span>
          </div>

          <h3 className="text-[13px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1">
            Curriculum Modules
          </h3>

          <div className="flex items-baseline gap-2 mb-2.5">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {data.lessonsCount}
            </span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden mb-2.5">
            <div className="bg-sky-500 h-full rounded-full w-4/5" />
          </div>

          <p className="text-[13.5px] font-medium text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>{data.videoLessonsCount} video streams configured</span>
            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-sky-600" />
          </p>
        </Link>

        {/* Card 4: Reviews & Feedback */}
        <Link
          href="/admin/collections/reviews"
          className="group relative p-5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xs hover:shadow-md hover:border-amber-300 dark:hover:border-amber-800 transition-all"
        >
          <div className="flex items-center justify-between mb-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-100 dark:border-amber-900 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Star className="w-5 h-5" />
            </div>
            <span className="text-[12px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              All Approved
            </span>
          </div>

          <h3 className="text-[13px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1">
            Student Feedback
          </h3>

          <div className="flex items-baseline gap-2 mb-2.5">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {data.totalReviewsCount}
            </span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden mb-2.5">
            <div className="bg-emerald-500 h-full rounded-full w-full" />
          </div>

          <p className="text-[13.5px] font-medium text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>All reviews published live</span>
            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-amber-600" />
          </p>
        </Link>
      </div>

      {/* 3. Quick Dispatch Shortcuts Toolbar */}
      <div className="p-5 sm:p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="text-[14px] font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
            Quick Dispatch
          </h4>
          <span className="text-[12.5px] font-medium text-slate-500 dark:text-slate-400">
            Direct Creation Shortcuts
          </span>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href="/admin/collections/courses/create"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-[13px] font-bold text-slate-700 dark:text-slate-200 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4 text-indigo-600" />
            <span>Course</span>
          </Link>

          <Link
            href="/admin/collections/sections/create"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-[13px] font-bold text-slate-700 dark:text-slate-200 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4 text-sky-600" />
            <span>Section</span>
          </Link>

          <Link
            href="/admin/collections/lessons/create"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-[13px] font-bold text-slate-700 dark:text-slate-200 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4 text-emerald-600" />
            <span>Lesson</span>
          </Link>

          <Link
            href="/admin/collections/posts/create"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-[13px] font-bold text-slate-700 dark:text-slate-200 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4 text-rose-600" />
            <span>Journal Post</span>
          </Link>

          <Link
            href="/admin/collections/pages/create"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-[13px] font-bold text-slate-700 dark:text-slate-200 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4 text-indigo-600" />
            <span>Page</span>
          </Link>

          <Link
            href="/admin/collections/media/create"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-[13px] font-bold text-slate-700 dark:text-slate-200 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4 text-slate-500" />
            <span>Upload Media</span>
          </Link>

          <Link
            href="/admin/globals/site-settings"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-[13px] font-bold text-slate-700 dark:text-slate-200 transition-all hover:scale-[1.02]"
          >
            <Settings className="w-4 h-4 text-slate-500" />
            <span>Settings</span>
          </Link>
        </div>
      </div>

      {/* 4. Core Operational Two-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Left Column: Enrollments & Student Stream (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 sm:p-7 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
                <h3 className="text-[16.5px] font-bold text-slate-900 dark:text-white">
                  Recent Student Enrollments
                </h3>
              </div>
              <Link
                href="/admin/collections/enrollments"
                className="text-[13px] font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1 transition-colors"
              >
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-zinc-800/60 mt-2">
              {data.recentEnrollments && data.recentEnrollments.length > 0 ? (
                data.recentEnrollments.map((en) => (
                  <div
                    key={en.id}
                    className="py-3.5 flex items-center justify-between gap-3 group hover:bg-slate-50/60 dark:hover:bg-zinc-800/40 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {en.studentName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[14.5px] font-bold text-slate-900 dark:text-white truncate">
                          {en.studentName}
                        </span>
                        <span className="text-[13px] text-slate-500 dark:text-slate-400 truncate">
                          {en.courseTitle}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-[11.5px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        {en.source}
                      </span>
                      <span className="text-[12.5px] text-slate-400 font-medium">
                        {en.date}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-zinc-800 text-slate-400 mx-auto flex items-center justify-center">
                    <Ticket className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                      No Recent Enrollments Recorded
                    </h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto mt-0.5">
                      Student registrations and new course enrollments will appear here in real-time.
                    </p>
                  </div>
                  <Link
                    href="/admin/collections/enrollments/create"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-2 rounded-xl border border-indigo-200 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Enroll Student Manually</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Platform Health & Cloud Infrastructure (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-7 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h3 className="text-[16.5px] font-bold text-slate-900 dark:text-white">
                  Curriculum Health
                </h3>
              </div>
              <Link
                href="/admin/collections/reviews"
                className="text-[13px] font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
              >
                <span>Reviews Queue</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Moderation Status Banner */}
            <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/80 rounded-xl flex items-start gap-2.5">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-emerald-900 dark:text-emerald-200 text-[14px] block">
                  Review Queue is Clean
                </span>
                <span className="text-emerald-700 dark:text-emerald-300 text-[13px]">
                  All student feedback has been moderated and published live.
                </span>
              </div>
            </div>

            {/* Course Publishing Index Progress */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-600 dark:text-slate-300">Course Publishing Index</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">100%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full w-full" />
              </div>
            </div>

            {/* Video Stream Coverage */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-600 dark:text-slate-300">Video Stream Coverage</span>
                <span className="font-bold text-sky-600 dark:text-sky-400">
                  {data.lessonsCount > 0 ? `${Math.round((data.videoLessonsCount / data.lessonsCount) * 100)}%` : '0%'}
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-sky-500 h-full rounded-full transition-all"
                  style={{
                    width: data.lessonsCount > 0 ? `${Math.round((data.videoLessonsCount / data.lessonsCount) * 100)}%` : '0%',
                  }}
                />
              </div>
            </div>

            {/* Taxonomy & Lead Faculty Badges */}
            <div className="pt-2 grid grid-cols-2 gap-2.5">
              <Link
                href="/admin/collections/categories"
                className="p-3 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800/60 dark:hover:bg-zinc-800 rounded-xl border border-slate-200/80 dark:border-zinc-700 flex items-center justify-between text-xs transition-colors"
              >
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-[13px] block">Categories</span>
                  <span className="text-[11px] text-slate-400">Taxonomy</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                href="/admin/collections/instructors"
                className="p-3 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800/60 dark:hover:bg-zinc-800 rounded-xl border border-slate-200/80 dark:border-zinc-700 flex items-center justify-between text-xs transition-colors"
              >
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-[13px] block">Instructors</span>
                  <span className="text-[11px] text-slate-400">Faculty</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>

          {/* Cloud Infrastructure Card */}
          <div className="p-5 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="w-4.5 h-4.5 text-indigo-400" />
                <span className="text-[13px] font-bold text-white uppercase tracking-wider">
                  Cloud Infrastructure
                </span>
              </div>
              <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Operational
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2.5">
                <Database className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <div className="min-w-0">
                  <span className="block text-[11px] text-slate-400 font-medium">PostgreSQL</span>
                  <span className="font-bold text-white text-xs truncate block">Active Pool</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2.5">
                <Film className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <div className="min-w-0">
                  <span className="block text-[11px] text-slate-400 font-medium">Video Player</span>
                  <span className="font-bold text-white text-xs truncate block">Mux Streaming</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2.5">
                <HardDrive className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <div className="min-w-0">
                  <span className="block text-[11px] text-slate-400 font-medium">Cloud S3</span>
                  <span className="font-bold text-white text-xs truncate block">Supabase S3</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <div className="min-w-0">
                  <span className="block text-[11px] text-slate-400 font-medium">Auth Engine</span>
                  <span className="font-bold text-white text-xs truncate block">Argon2id JWT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Complete 14 Database Collections Directory */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
              Collections Directory ({collectionsList.length})
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Direct access to orchestrate all 14 database models and global platform configuration.
            </p>
          </div>

          {/* Search filter */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter collections..."
              style={{ paddingLeft: '38px', paddingRight: '32px' }}
              className="w-full py-2 text-sm bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-2xs transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[13px] font-semibold scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold shadow-xs'
                : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50'
            }`}
          >
            <span>All Collections</span>
            <span className="text-[11px] font-bold opacity-80">({categoryCounts.all})</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('academic')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              selectedCategory === 'academic'
                ? 'bg-indigo-600 text-white font-bold shadow-xs'
                : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50'
            }`}
          >
            <span>Curriculum</span>
            <span className="text-[11px] font-bold opacity-80">({categoryCounts.academic})</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('community')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              selectedCategory === 'community'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50'
            }`}
          >
            <span>Community</span>
            <span className="text-[11px] font-bold opacity-80">({categoryCounts.community})</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('content')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              selectedCategory === 'content'
                ? 'bg-rose-600 text-white font-bold shadow-xs'
                : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50'
            }`}
          >
            <span>Editorial</span>
            <span className="text-[11px] font-bold opacity-80">({categoryCounts.content})</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('system')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              selectedCategory === 'system'
                ? 'bg-slate-700 text-white font-bold shadow-xs'
                : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50'
            }`}
          >
            <span>System</span>
            <span className="text-[11px] font-bold opacity-80">({categoryCounts.system})</span>
          </button>
        </div>

        {/* Collections Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {filteredCollections.map((col) => {
            const IconComponent = col.icon
            const count = col.countKey ? data.counts[col.countKey] : undefined

            return (
              <div
                key={col.slug}
                className="group relative p-5 sm:p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className={`w-10 h-10 rounded-xl ${col.iconBg} border ${col.iconBorder} flex items-center justify-center ${col.iconColor}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-slate-300 border border-slate-200 dark:border-zinc-700">
                        {col.categoryLabel}
                      </span>
                      {typeof count === 'number' && (
                        <span className="text-xs font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-zinc-800/80 px-2.5 py-0.5 rounded-lg border border-slate-200 dark:border-zinc-700">
                          {count}
                        </span>
                      )}
                    </div>
                  </div>

                  <h4 className="text-[15px] font-bold text-slate-900 dark:text-white mb-1 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {col.title}
                  </h4>

                  <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {col.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center gap-2">
                  <Link
                    href={col.browsePath}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800/60 dark:hover:bg-zinc-800 text-xs sm:text-[13px] font-bold text-slate-700 dark:text-slate-200 text-center transition-colors border border-slate-200/60 dark:border-zinc-700"
                  >
                    Browse
                  </Link>

                  {col.createPath && (
                    <Link
                      href={col.createPath}
                      title={`Create New ${col.singular}`}
                      className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 transition-colors border border-indigo-200/80 dark:border-indigo-800"
                    >
                      <Plus className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default DashboardClient
