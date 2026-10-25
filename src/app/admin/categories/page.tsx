import React from 'react'
import { getCategories } from '@/lib/db/queries'
import { CategoriesManagerClient } from '@/components/admin/CategoriesManagerClient'

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
  const categories = await getCategories()
  return <CategoriesManagerClient initialCategories={categories} />
}
