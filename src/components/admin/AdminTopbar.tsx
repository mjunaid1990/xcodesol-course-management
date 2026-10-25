'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Menu,
  Search,
  Bell,
  Plus,
  ExternalLink,
  CheckCircle2,
  Database,
  Sparkles,
} from 'lucide-react'

interface AdminTopbarProps {
  onToggleMobile: () => void
}

export function AdminTopbar({ onToggleMobile }: AdminTopbarProps) {
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-white/[0.06] bg-[#07090e]/90 px-4 sm:px-8 backdrop-blur-xl">
      {/* Left Area: Toggle & Search */}
      <div className="flex items-center gap-3.5 flex-1 max-w-md">
        <button
          onClick={onToggleMobile}
          className="rounded-xl p-2 text-slate-400 hover:bg-white/[0.05] hover:text-white lg:hidden transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative w-full max-w-xs hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses, students, orders..."
            className="w-full rounded-full border border-white/[0.07] bg-slate-950/80 pl-9 pr-12 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-brand-500/70 focus:outline-none focus:ring-2 focus:ring-brand-500/15 transition-all"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md border border-white/[0.08] bg-slate-900 px-1.5 py-0.5 text-[10px] text-slate-400 font-mono font-medium">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Area: System Status, New Course CTA, Notifications, Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* PostgreSQL Database status badge */}
        <div className="hidden md:flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>PostgreSQL Active</span>
        </div>

        {/* View Live Site Link */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-white/[0.07] bg-slate-900/60 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-white/[0.15] hover:bg-slate-800 hover:text-white transition-all"
        >
          <span>Live Site</span>
          <ExternalLink className="h-3 w-3 text-slate-400" />
        </Link>

        {/* Create Course Button */}
        <Link
          href="/admin/courses/new"
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm shadow-brand-600/30 hover:from-brand-500 hover:to-indigo-500 active:scale-95 transition-all"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Create Course</span>
        </Link>

        {/* Notifications Dropdown Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-xl border border-slate-800 bg-slate-900/60 p-2 text-slate-400 hover:border-slate-700 hover:text-white transition-all cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2.5 w-80 rounded-2xl border border-slate-800 bg-[#0d1322] p-4 shadow-2xl z-50 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-white">Notifications</span>
                <span className="text-[10px] text-blue-400 font-medium cursor-pointer hover:underline">
                  Mark all read
                </span>
              </div>
              <div className="py-2 space-y-2">
                <div className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-slate-800/40 transition-colors">
                  <div className="mt-0.5 rounded-lg bg-emerald-500/10 p-1 text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-xs text-white font-semibold">New enrollment</p>
                    <p className="text-[11px] text-slate-400">David Chen enrolled in Next.js 15 Masterclass.</p>
                    <span className="text-[10px] text-slate-500 font-mono">12 min ago</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-slate-800/40 transition-colors">
                  <div className="mt-0.5 rounded-lg bg-amber-500/10 p-1 text-amber-400">
                    <Bell className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-xs text-white font-semibold">Review Pending</p>
                    <p className="text-[11px] text-slate-400">Lucas Meyer submitted a 5.0 rating.</p>
                    <span className="text-[10px] text-slate-500 font-mono">1 hour ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Small Instructor Avatar */}
        <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 font-bold text-white text-[11px] shadow-sm">
          SJ
        </div>
      </div>
    </header>
  )
}
