import React from 'react'
import type { Payload } from 'payload'
import { getPayloadClient } from '@/lib/payload'
import { DashboardClient, type DashboardData } from './DashboardClient'

type DashboardProps = {
  payload?: Payload
  user?: {
    id?: string | number
    name?: string | null
    email?: string
    role?: string
  }
}

export const DashboardOverview: React.FC<DashboardProps> = async (props) => {
  let payloadInstance = props.payload
  if (!payloadInstance) {
    try {
      payloadInstance = await getPayloadClient()
    } catch {
      // fallback if payload cannot initialize
    }
  }

  const currentUser = props.user

  let coursesCount = 0
  let publishedCourses = 0
  let draftCourses = 0
  let studentsCount = 0
  let activeEnrollmentsCount = 0
  let lessonsCount = 0
  let videoLessonsCount = 0
  let pendingReviewsCount = 0
  let totalReviewsCount = 0
  let recentEnrollments: Array<{
    id: string | number
    studentName: string
    courseTitle: string
    source: string
    date: string
  }> = []

  if (payloadInstance) {
    try {
      const [courses, users, enrollments, lessons, reviews] = await Promise.all([
        payloadInstance.find({ collection: 'courses', limit: 200, depth: 0, overrideAccess: true }).catch(() => ({ docs: [], totalDocs: 0 })),
        payloadInstance.find({ collection: 'users', limit: 500, depth: 0, overrideAccess: true }).catch(() => ({ docs: [], totalDocs: 0 })),
        payloadInstance.find({ collection: 'enrollments', limit: 8, sort: '-createdAt', depth: 1, overrideAccess: true }).catch(() => ({ docs: [], totalDocs: 0 })),
        payloadInstance.find({ collection: 'lessons', limit: 500, depth: 0, overrideAccess: true }).catch(() => ({ docs: [], totalDocs: 0 })),
        payloadInstance.find({ collection: 'reviews', limit: 10, sort: '-createdAt', depth: 1, overrideAccess: true }).catch(() => ({ docs: [], totalDocs: 0 })),
      ])

      coursesCount = courses.totalDocs || courses.docs.length
      publishedCourses = courses.docs.filter((c: any) => c._status === 'published').length
      draftCourses = coursesCount - publishedCourses

      studentsCount = users.docs.filter((u: any) => u.role === 'student').length
      if (studentsCount === 0 && users.docs.length > 0) {
        studentsCount = users.totalDocs || users.docs.length
      }

      activeEnrollmentsCount = enrollments.totalDocs || enrollments.docs.length
      recentEnrollments = (enrollments.docs || []).map((en: any) => ({
        id: en.id,
        studentName: en.user?.name || en.user?.email || (typeof en.user === 'string' ? en.user : 'Student'),
        courseTitle: en.course?.title || (typeof en.course === 'string' ? en.course : 'Course'),
        source: en.source || 'Active',
        date: en.createdAt ? new Date(en.createdAt).toLocaleDateString() : 'Recent',
      }))

      lessonsCount = lessons.totalDocs || lessons.docs.length
      videoLessonsCount = lessons.docs.filter((l: any) => l.type === 'video').length

      totalReviewsCount = reviews.totalDocs || reviews.docs.length
      pendingReviewsCount = reviews.docs.filter((r: any) => !r.approved).length
    } catch (e) {
      console.error('[DashboardOverview] Error loading overview metrics:', e)
    }
  }

  const dashboardData: DashboardData = {
    userName: currentUser?.name || currentUser?.email?.split('@')[0] || 'Administrator',
    userRole: (currentUser?.role || 'admin').toUpperCase(),
    userEmail: currentUser?.email || 'admin@example.com',
    coursesCount,
    publishedCourses,
    draftCourses,
    studentsCount,
    activeEnrollmentsCount,
    lessonsCount,
    videoLessonsCount,
    totalReviewsCount,
    pendingReviewsCount,
    recentEnrollments,
  }

  return <DashboardClient data={dashboardData} />
}

export default DashboardOverview
