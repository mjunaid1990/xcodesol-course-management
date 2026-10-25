'use client'

import React, { useState } from 'react'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminTopbar } from '@/components/admin/AdminTopbar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#07080c] text-slate-100">
      {/* Sidebar */}
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminTopbar onToggleMobile={() => setMobileOpen(!mobileOpen)} />
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8 lg:px-9 lg:py-8">
          <div className="mx-auto max-w-7xl space-y-7">{children}</div>
        </main>
      </div>
    </div>
  )
}
