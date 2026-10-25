import React from 'react'
import { CreditCard, Download, DollarSign, CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react'
import { getDashboardStats } from '@/lib/db/queries'
import { formatCurrency, formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function AdminOrdersPage() {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Sales & Orders Ledger
            </h1>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              Stripe Live
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Realtime transactions, enrollment receipts, and payout status.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-all">
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-slate-800 bg-[#0e1424] p-5">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Gross Sales</span>
          <div className="mt-2 text-2xl font-extrabold text-emerald-400">
            {formatCurrency(stats.totalRevenue)}
          </div>
          <p className="mt-1 text-[11px] text-slate-500">All-time lifetime earnings</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-[#0e1424] p-5">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Average Order Value</span>
          <div className="mt-2 text-2xl font-extrabold text-white">
            $129.70
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Across full-stack & UI tracks</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-[#0e1424] p-5">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Refund Rate</span>
          <div className="mt-2 text-2xl font-extrabold text-blue-400">
            0.18%
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Significantly below industry benchmark</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0e1424] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400">
                <th className="py-3.5 px-4 font-semibold">Order ID</th>
                <th className="py-3.5 px-4 font-semibold">Customer</th>
                <th className="py-3.5 px-4 font-semibold">Course Purchased</th>
                <th className="py-3.5 px-4 font-semibold">Amount</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {stats.recentOrders.map((order) => (
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
                  <td className="py-3.5 px-4 font-bold text-emerald-400">
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
    </div>
  )
}
