import React from 'react'
import { notFound } from 'next/navigation'
import { getCourseBySlug } from '@/lib/db/queries'
import { CourseEditorClient } from '@/components/admin/CourseEditorClient'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminCourseDetailPage({ params }: Props) {
  const { id } = await params
  const data = await getCourseBySlug(id)

  if (!data) {
    notFound()
  }

  return <CourseEditorClient initialCourse={data.course} initialSections={data.sections} />
}
