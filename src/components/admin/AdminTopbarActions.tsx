'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import {
  Search,
  Bell,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  BookOpen,
  Users,
  Video,
  FileText,
  Settings,
  ShieldCheck,
  X,
} from 'lucide-react'

export function AdminTopbarActions() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(2)

  const notifRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Quick navigation items for search
  const quickLinks = [
    { label: 'Courses Curriculum', href: '/admin/collections/courses', icon: BookOpen, type: 'Curriculum' },
    { label: 'Lessons & Video Streams', href: '/admin/collections/lessons', icon: Video, type: 'Curriculum' },
    { label: 'Students & Users', href: '/admin/collections/users', icon: Users, type: 'Community' },
    { label: 'Student Enrollments', href: '/admin/collections/enrollments', icon: Users, type: 'Community' },
    { label: 'Journal Posts', href: '/admin/collections/posts', icon: FileText, type: 'Editorial' },
    { label: 'Platform Settings', href: '/admin/globals/site-settings', icon: Settings, type: 'System' },
  ]

  const filteredLinks = searchQuery.trim()
    ? quickLinks.filter((item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase().trim()),
      )
    : quickLinks

  const notifications = [
    {
      id: 1,
      title: 'Review Queue Clean',
      desc: 'All course feedback has been moderated and approved live.',
      time: 'Just now',
      unread: true,
      icon: CheckCircle2,
      color: 'text-emerald-500',
    },
    {
      id: 2,
      title: 'Cloud Infrastructure Ready',
      desc: 'PostgreSQL pool, Mux streaming & Supabase S3 operational.',
      time: '12m ago',
      unread: true,
      icon: ShieldCheck,
      color: 'text-indigo-500',
    },
    {
      id: 3,
      title: 'System Security Audit',
      desc: 'Argon2id password hashing & rate limiting enforced.',
      time: '1h ago',
      unread: false,
      icon: Clock,
      color: 'text-slate-400',
    },
  ]

  return (
    <div className="flex items-center gap-2.5 sm:gap-3.5 select-none mr-1 sm:mr-2">
      {/* 1. Global Search Bar */}
      <div className="relative" ref={searchRef}>
        <div className="relative flex items-center">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              if (!searchOpen) setSearchOpen(true)
            }}
            onFocus={() => setSearchOpen(true)}
            placeholder="Search curriculum, students, lessons..."
            style={{ paddingLeft: '40px', paddingRight: '48px' }}
            className="w-40 xs:w-48 sm:w-56 md:w-64 lg:w-72 py-2 text-[13.5px] sm:text-[14px] bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-bold text-slate-400 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded shadow-xs pointer-events-none z-10">
            ⌘K
          </kbd>
        </div>

        {/* Search Results Dropdown */}
        {searchOpen && (
          <div className="absolute right-0 sm:left-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-slate-200 dark:border-zinc-800 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 border-b border-slate-100 dark:border-zinc-800 pb-1.5 mb-1">
              <span>Quick Navigation</span>
              <span className="text-[11px] font-medium text-slate-400">
                {filteredLinks.length} results
              </span>
            </div>

            <div className="space-y-0.5 max-h-64 overflow-y-auto">
              {filteredLinks.map((item) => {
                const IconComponent = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      setSearchOpen(false)
                      setSearchQuery('')
                    }}
                    className="flex items-center justify-between px-2.5 py-2.5 rounded-lg text-[13.5px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <IconComponent className="w-4.5 h-4.5 text-slate-400 group-hover:text-indigo-600 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </div>
                    <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                      {item.type}
                    </span>
                  </Link>
                )
              })}

              {filteredLinks.length === 0 && (
                <div className="py-4 text-center text-xs text-slate-400">
                  No matching models found for &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 2. Notifications Bell Dropdown */}
      <div className="relative" ref={notifRef}>
        <button
          type="button"
          onClick={() => setNotifOpen(!notifOpen)}
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800/80 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-zinc-700"
          title="Studio Notifications"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-zinc-900 animate-pulse" />
          )}
        </button>

        {/* Notifications Popover */}
        {notifOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 sm:w-88 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-800 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[15px] text-slate-900 dark:text-white tracking-tight">
                  Studio Notifications
                </span>
                {unreadCount > 0 && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    {unreadCount} New
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => setUnreadCount(0)}
                  className="text-[11px] font-semibold text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Mark read
                </button>
              )}
            </div>

            <div className="divide-y divide-slate-100 dark:divide-zinc-800/60 my-1 max-h-72 overflow-y-auto">
              {notifications.map((n) => {
                const IconComponent = n.icon
                return (
                  <div
                    key={n.id}
                    className="py-2.5 px-2 hover:bg-slate-50/70 dark:hover:bg-zinc-800/40 rounded-xl transition-colors flex items-start gap-2.5"
                  >
                    <IconComponent className={`w-4 h-4 ${n.color} flex-shrink-0 mt-0.5`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[13.5px] font-bold text-slate-900 dark:text-white truncate">
                          {n.title}
                        </span>
                        <span className="text-[11px] text-slate-400 flex-shrink-0">
                          {n.time}
                        </span>
                      </div>
                      <p className="text-[12.5px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                        {n.desc}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-[11px]">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                All Systems Operational
              </span>
              <button
                type="button"
                onClick={() => setNotifOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminTopbarActions
