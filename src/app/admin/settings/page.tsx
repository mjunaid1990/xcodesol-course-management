import React from 'react'
import { getSiteSettings } from '@/lib/db/queries'
import { SiteSettingsClient } from '@/components/admin/SiteSettingsClient'

export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings()
  return <SiteSettingsClient initialSettings={settings} />
}
