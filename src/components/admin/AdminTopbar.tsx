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
  Moon,
  Sun,
} from 'lucide-react'

interface AdminTopbarProps {
  onToggleMobile: () => void
}

export function AdminTopbar({ onToggleMobile }: AdminTopbarProps) {
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-18 w-full items-center justify-between border-b border-slate-800/80 bg-[#0d1322]/90 px-4 sm:px-8 backdrop-blur-md">
      {/* Left Area: Toggle & Search */}
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        <button
          onClick={onToggleMobile}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative w-full max-w-sm hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses, students, orders..."
            className="w-full rounded-xl border border-slate-700/70 bg-slate-900/60 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400 font-mono">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Area: System Status, New Course CTA, Notifications */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* System / DB Status indicator */}
        <div className="hidden md:flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 text-xs text-slate-300">
          <Database className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-[11px] font-medium text-slate-300">PostgreSQL Schema Ready</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {/* View Live Site Link */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-800/60 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700/60 hover:text-white transition-colors"
        >
          <span>Live Site</span>
          <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
        </Link>

        {/* Create Course Button */}
        <Link
          href="/admin/courses/new"
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-blue-600/30 hover:bg-blue-500 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden xs:inline">New Course</span>
        </Link>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-xl border border-slate-800 bg-slate-900/60 p-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-800 bg-[#111827] p-4 shadow-xl z-50">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-semibold text-white">Notifications</span>
                <span className="text-[10px] text-blue-400 font-medium">Mark all read</span>
              </div>
              <div className="py-2 space-y-3">
                <div className="flex items-start gap-3 rounded-lg p-2 hover:bg-slate-800/40 transition-colors">
                  <div className="mt-0.5 rounded-full bg-emerald-500/10 p-1 text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-200 font-medium">New student enrolled!</p>
                    <p className="text-[11px] text-slate-400">David Chen purchased Next.js 15 course.</p>
                    <span className="text-[10px] text-slate-500">12 min ago</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg p-2 hover:bg-slate-800/40 transition-colors">
                  <div className="mt-0.5 rounded-full bg-amber-500/10 p-1 text-amber-400">
                    <Bell className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-200 font-medium">Review pending approval</p>
                    <p className="text-[11px] text-slate-400">Lucas Meyer left a 5-star review.</p>
                    <span className="text-[10px] text-slate-500">1 hour ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
