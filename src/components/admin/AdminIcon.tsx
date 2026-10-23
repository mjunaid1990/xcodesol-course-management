'use client'

import React from 'react'
import { LayoutDashboard } from 'lucide-react'

/**
 * AdminIcon is rendered inside Payload's StepNav.
 * Rendering "Dashboard" with a dashboard icon establishes the root breadcrumb:
 * - On Dashboard: "Dashboard"
 * - On any module: "Dashboard / {Module}"
 */
export const AdminIcon: React.FC = () => {
  return (
    <span className="inline-flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-[14px]">
      <LayoutDashboard className="w-4 h-4 text-slate-400 dark:text-zinc-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex-shrink-0" />
      <span>Dashboard</span>
    </span>
  )
}

export default AdminIcon
