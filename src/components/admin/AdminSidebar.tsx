'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  FolderTree,
  Users,
  CreditCard,
  Star,
  FileText,
  Settings,
  Sparkles,
  ExternalLink,
  ChevronRight,
  GraduationCap,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminSidebarProps {
  mobileOpen: boolean
  setMobileOpen: (open: boolean) => void
}

const NAV_ITEMS = [
  {
    group: 'Management',
    items: [
      { label: 'Overview', href: '/admin', icon: LayoutDashboard },
      { label: 'Courses', href: '/admin/courses', icon: BookOpen },
      { label: 'Categories', href: '/admin/categories', icon: FolderTree },
      { label: 'Students', href: '/admin/students', icon: Users },
      { label: 'Orders & Sales', href: '/admin/orders', icon: CreditCard },
      { label: 'Reviews', href: '/admin/reviews', icon: Star, badge: '1 pending' },
    ],
  },
  {
    group: 'Content & Settings',
    items: [
      { label: 'Blog Posts', href: '/admin/posts', icon: FileText },
      { label: 'Site Settings', href: '/admin/settings', icon: Settings },
    ],
  },
]

export function AdminSidebar({ mobileOpen, setMobileOpen }: AdminSidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col border-r border-slate-800/80 bg-[#0d1322] transition-transform duration-300 ease-in-out lg:static lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="flex h-18 items-center justify-between px-6 border-b border-slate-800/80">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold tracking-tight text-white text-base">
                Fieldnotes <span className="text-blue-400 font-extrabold text-xs px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">STUDIO</span>
              </div>
              <p className="text-[11px] font-medium text-slate-400">Admin & Course CMS</p>
            </div>
          </Link>

          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {NAV_ITEMS.map((section, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {section.group}
              </div>
              <nav className="space-y-1">
                {section.items.map((item) => {
                  const active = isActive(item.href)
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150',
                        active
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                          : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={cn(
                            'h-4 w-4 transition-colors',
                            active ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                          )}
                        />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={cn(
                            'text-[10px] font-semibold px-2 py-0.5 rounded-full',
                            active
                              ? 'bg-white/20 text-white'
                              : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </nav>
            </div>
          ))}

          {/* Quick Shortcuts Box */}
          <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/60 to-slate-900/20 p-4 text-xs space-y-3">
            <div className="flex items-center gap-2 text-slate-200 font-semibold">
              <Sparkles className="h-4 w-4 text-blue-400" />
              <span>Public Live Site</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Preview changes to marketing pages, published lessons, and course catalog.
            </p>
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-semibold text-xs group"
            >
              <span>Launch frontend</span>
              <ExternalLink className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* User / Instructor Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center justify-between rounded-xl p-2 bg-slate-800/40 border border-slate-800/60">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 font-bold text-white text-xs shadow">
                SJ
              </div>
              <div className="truncate">
                <div className="text-xs font-semibold text-white truncate">Sarah Jenkins</div>
                <div className="text-[10px] text-slate-400 truncate">Instructor & Admin</div>
              </div>
            </div>
            <span className="h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 shrink-0" title="Online" />
          </div>
        </div>
      </aside>
    </>
  )
}
