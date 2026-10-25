import React from 'react'
import { getStudentsList, getCoursesList } from '@/lib/db/queries'
import { StudentsManagerClient } from '@/components/admin/StudentsManagerClient'

export const dynamic = 'force-dynamic'

export default async function AdminStudentsPage() {
  const [students, courses] = await Promise.all([
    getStudentsList(),
    getCoursesList(),
  ])

  return (
    <StudentsManagerClient
      initialStudents={students}
      courses={courses.map((c) => ({ id: c.id, title: c.title }))}
    />
  )
}
