import React from 'react'
import { getCoursesList } from '@/lib/db/queries'
import { CoursesManagerClient } from '@/components/admin/CoursesManagerClient'

export const dynamic = 'force-dynamic'

export default async function AdminCoursesPage() {
  const courses = await getCoursesList()
  return <CoursesManagerClient initialCourses={courses} />
}
