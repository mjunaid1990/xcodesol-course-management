'use client'

import React, { useState } from 'react'
import { Download, Search, CheckCircle2, CreditCard, DollarSign, ArrowUpDown } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { showToast } from '@/lib/toast'

export interface OrderItem {
  id: string
  user_name: string
  user_email: string
  course_title: string
  amount: number
  currency: string
  status: string
  created_at: string
}

interface Props {
  initialOrders: OrderItem[]
  totalRevenue: number
}

export function OrdersManagerClient({ initialOrders, totalRevenue }: Props) {
  const [orders, setOrders] = useState<OrderItem[]>(initialOrders)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'succeeded' | 'pending'>('all')

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.user_name.toLowerCase().includes(search.toLowerCase()) ||
      o.user_email.toLowerCase().includes(search.toLowerCase()) ||
      o.course_title.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase())

    const matchesStatus = statusFilter === 'all' || o.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleExportCSV = () => {
    if (filteredOrders.length === 0) {
      showToast.error('Export Empty', 'There are no orders matching current filters to export.')
      return
    }

    const headers = ['Order ID', 'Customer Name', 'Customer Email', 'Course Title', 'Amount', 'Currency', 'Status', 'Date']
    const rows = filteredOrders.map((o) => [
      `"${o.id}"`,
      `"${o.user_name.replace(/"/g, '""')}"`,
      `"${o.user_email}"`,
      `"${o.course_title.replace(/"/g, '""')}"`,
      o.amount,
      o.currency,
      o.status,
      `"${o.created_at}"`,
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `orders-ledger-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    showToast.success('Export Complete', `Downloaded ${filteredOrders.length} transaction records as CSV.`)
  }

  return (
    <div className="space-y-7 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Sales & Orders Ledger
            </h1>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              Stripe Live
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Realtime transactions, enrollment receipts, and payout status.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-all cursor-pointer shadow-sm"
        >
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-white/[0.07] bg-[#0c0e17]/85 luxury-card p-5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Gross Sales</span>
          <div className="mt-2 text-2xl font-extrabold text-emerald-400 font-mono">
            {formatCurrency(totalRevenue)}
          </div>
          <p className="mt-1 text-[11px] text-slate-500">All-time lifetime earnings</p>
        </div>
        <div className="rounded-2xl border border-white/[0.07] bg-[#0c0e17]/85 luxury-card p-5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Average Order Value</span>
          <div className="mt-2 text-2xl font-extrabold text-white font-mono">
            $129.70
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Across full-stack & UI tracks</p>
        </div>
        <div className="rounded-2xl border border-white/[0.07] bg-[#0c0e17]/85 luxury-card p-5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Refund Rate</span>
          <div className="mt-2 text-2xl font-extrabold text-blue-400 font-mono">
            0.18%
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Significantly below industry benchmark</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3.5 rounded-2xl border border-white/[0.07] bg-[#0c0e17]/85 luxury-card p-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search customer, email, course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/[0.07] bg-slate-950/80 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-center">
          {(['all', 'succeeded', 'pending'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold capitalize transition-all cursor-pointer ${
                statusFilter === status
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30'
                  : 'border border-white/[0.06] bg-slate-900/40 text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.07] bg-[#0c0e17]/85 luxury-card p-12 text-center">
          <CreditCard className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white">No transactions found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {search ? 'No order matches your current search filters.' : 'Completed student checkout orders will appear in this ledger.'}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0c0e17]/85 luxury-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.07] bg-slate-900/40 text-slate-400">
                  <th className="py-3.5 px-4 font-semibold">Order ID</th>
                  <th className="py-3.5 px-4 font-semibold">Customer</th>
                  <th className="py-3.5 px-4 font-semibold">Course Purchased</th>
                  <th className="py-3.5 px-4 font-semibold">Amount</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                      {order.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{order.user_name}</div>
                      <div className="text-[11px] text-slate-400">{order.user_email}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-200 max-w-[280px] truncate">
                      {order.course_title}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400 font-mono">
                      {formatCurrency(order.amount, order.currency)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20 capitalize">
                        <CheckCircle2 className="h-3 w-3" />
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {formatDate(order.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
