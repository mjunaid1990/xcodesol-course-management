'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  Search,
  LogOut,
  ChevronRight,
  Shield,
  Sparkles,
  Layers,
} from 'lucide-react'

type NavItem = {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string | number
  exact?: boolean
}

type NavGroup = {
  groupTitle: string
  items: NavItem[]
}

export function AdminSidebar() {
  const pathname = usePathname() || '/admin'
  const [filterQuery, setFilterQuery] = useState('')

  const navGroups: NavGroup[] = [
    {
      groupTitle: 'Overview',
      items: [
        { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
        { label: 'Live Platform', href: '/', icon: ExternalLink },
        { label: 'Student Space', href: '/dashboard', icon: GraduationCap },
      ],
    },
    {
      groupTitle: 'Curriculum & LMS',
      items: [
        { label: 'Courses', href: '/admin/collections/courses', icon: BookOpen },
        { label: 'Sections', href: '/admin/collections/sections', icon: FolderTree },
        { label: 'Lessons', href: '/admin/collections/lessons', icon: Video },
        { label: 'Resources', href: '/admin/collections/course-resources', icon: FolderArchive },
        { label: 'Categories', href: '/admin/collections/categories', icon: Tags },
      ],
    },
    {
      groupTitle: 'Learners & Community',
      items: [
        { label: 'Users & Staff', href: '/admin/collections/users', icon: Users },
        { label: 'Enrollments', href: '/admin/collections/enrollments', icon: Ticket },
        { label: 'Lesson Progress', href: '/admin/collections/lesson-progress', icon: TrendingUp },
        { label: 'Course Reviews', href: '/admin/collections/reviews', icon: Star },
      ],
    },
    {
      groupTitle: 'Editorial & Marketing',
      items: [
        { label: 'Pages', href: '/admin/collections/pages', icon: FileText },
        { label: 'Journal Posts', href: '/admin/collections/posts', icon: PenTool },
        { label: 'Faculty', href: '/admin/collections/instructors', icon: UserCheck },
        { label: 'Testimonials', href: '/admin/collections/testimonials', icon: Quote },
      ],
    },
    {
      groupTitle: 'System & Storage',
      items: [
        { label: 'Media Assets', href: '/admin/collections/media', icon: ImageIcon },
        { label: 'Site Settings', href: '/admin/globals/site-settings', icon: Settings },
      ],
    },
  ]

  const isItemActive = (item: NavItem) => {
    if (item.exact) {
      return pathname === item.href
    }
    return pathname.startsWith(item.href)
  }

  const filteredGroups = navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        item.label.toLowerCase().includes(filterQuery.toLowerCase().trim()),
      ),
    }))
    .filter((group) => group.items.length > 0)

  return (
    <aside className="nav custom-admin-sidebar w-64 min-w-[16rem] max-w-[16rem] h-screen sticky top-0 flex flex-col justify-between bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-zinc-800/80 shadow-sm font-sans z-30 select-none">
      {/* Top Header & Logo */}
      <div className="p-4 border-b border-slate-200 dark:border-zinc-800/80 flex flex-col gap-3">
        <Link
          href="/admin"
          className="flex items-center gap-3 group transition-transform hover:scale-[1.01]"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-emerald-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-indigo-500/20 flex-shrink-0">
            FN
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight truncate">
                Fieldnotes
              </span>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                PRO
              </span>
            </div>
            <span className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
              Studio Command
            </span>
          </div>
        </Link>

        {/* Quick Filter Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Search menu..."
            className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Scrollable Navigation Items */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5 custom-sidebar-scroll">
        {filteredGroups.map((group) => (
          <div key={group.groupTitle} className="space-y-1">
            <h4 className="px-2 text-[10px] font-extrabold tracking-wider uppercase text-slate-400 dark:text-zinc-500">
              {group.groupTitle}
            </h4>

            <div className="space-y-0.5">
              {group.items.map((item) => {
                const IconComponent = item.icon
                const active = isItemActive(item)

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                      active
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 font-bold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-zinc-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <IconComponent
                        className={`w-4 h-4 flex-shrink-0 transition-colors ${
                          active
                            ? 'text-indigo-600 dark:text-indigo-400'
                            : 'text-slate-400 dark:text-zinc-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {active ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                    ) : (
                      <ChevronRight className="w-3 h-3 text-slate-300 dark:text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Profile & Logout Footer */}
      <div className="p-3 border-t border-slate-200 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-950">
        <div className="flex items-center justify-between gap-2 p-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-sky-500 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
              <span>CA</span>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate leading-tight">
                Course Admin
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Full Access
              </span>
            </div>
          </div>

          <Link
            href="/admin/logout"
            title="Log Out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors flex-shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </aside>
  )
}

export default AdminSidebar
