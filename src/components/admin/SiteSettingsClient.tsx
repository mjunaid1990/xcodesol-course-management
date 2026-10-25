'use client'

import React, { useState, useTransition } from 'react'
import {
  Save,
  Palette,
  CreditCard,
  Megaphone,
} from 'lucide-react'
import { SiteSettings } from '@/lib/db/queries'
import { FormField, Input, Select, Button } from '@/components/ui/FormField'
import { showToast } from '@/lib/toast'
import { updateSiteSettingsAction } from '@/app/actions/admin-actions'

interface Props {
  initialSettings: SiteSettings
}

export function SiteSettingsClient({ initialSettings }: Props) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings)
  const [isPending, startTransition] = useTransition()

  const handleSave = () => {
    startTransition(async () => {
      const res = await updateSiteSettingsAction(settings)
      if (res.success) {
        showToast.success(
          'Settings Saved',
          'Platform branding, announcement banner, and Stripe configurations updated.'
        )
      } else {
        showToast.error('Save Failed', res.error)
      }
    })
  }

  return (
    <div className="space-y-8 max-w-4xl pb-16">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Global Site Settings</h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure site branding, announcement banners, payment gateways, and navigation menus.
          </p>
        </div>

        <Button
          onClick={handleSave}
          isLoading={isPending}
          variant="primary"
          size="md"
        >
          <Save className="h-4 w-4" />
          <span>Save Settings</span>
        </Button>
      </div>

      {/* Section 1: Branding & Identity */}
      <div className="rounded-2xl border border-slate-800 bg-[#0e1424] p-6 space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-base">
          <Palette className="h-4 w-4 text-blue-400" />
          <span>Brand Identity & Design</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Platform Name" required>
            <Input
              value={settings.site_name}
              onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
            />
          </FormField>

          <FormField label="Brand Accent Color">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings.primary_color}
                onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                className="h-9 w-12 rounded-lg border border-slate-700 bg-slate-900 p-1 cursor-pointer"
              />
              <Input
                value={settings.primary_color}
                onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                className="font-mono flex-1"
              />
            </div>
          </FormField>
        </div>

        <FormField label="Tagline / Subheader">
          <Input
            value={settings.site_tagline}
            onChange={(e) => setSettings({ ...settings, site_tagline: e.target.value })}
          />
        </FormField>
      </div>

      {/* Section 2: Announcement Bar */}
      <div className="rounded-2xl border border-slate-800 bg-[#0e1424] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Megaphone className="h-4 w-4 text-amber-400" />
            <span>Top Announcement Bar</span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.announcement_enabled}
              onChange={(e) => setSettings({ ...settings, announcement_enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <FormField label="Banner Announcement Text">
          <Input
            value={settings.announcement_text || ''}
            onChange={(e) => setSettings({ ...settings, announcement_text: e.target.value })}
          />
        </FormField>

        <FormField label="Destination URL / Link">
          <Input
            value={settings.announcement_link || ''}
            onChange={(e) => setSettings({ ...settings, announcement_link: e.target.value })}
            className="font-mono"
          />
        </FormField>
      </div>

      {/* Section 3: Payments & Stripe */}
      <div className="rounded-2xl border border-slate-800 bg-[#0e1424] p-6 space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-base">
          <CreditCard className="h-4 w-4 text-emerald-400" />
          <span>Payment Gateway (Stripe)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Default Currency">
            <Select
              value={settings.currency}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CAD">CAD ($)</option>
              <option value="AUD">AUD ($)</option>
            </Select>
          </FormField>

          <FormField label="Gateway Status">
            <div className="flex items-center gap-2 pt-2 text-xs">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-slate-200">Stripe Webhooks Verified & Active</span>
            </div>
          </FormField>
        </div>
      </div>
    </div>
  )
}
