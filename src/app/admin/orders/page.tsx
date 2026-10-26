import React from 'react'
import { getDashboardStats } from '@/lib/db/queries'
import { OrdersManagerClient } from '@/components/admin/OrdersManagerClient'

export const dynamic = 'force-dynamic'

export default async function AdminOrdersPage() {
  const stats = await getDashboardStats()

  return (
    <OrdersManagerClient
      initialOrders={stats.recentOrders}
      totalRevenue={stats.totalRevenue}
    />
  )
}
