import React from 'react'
import Link from 'next/link'
import type { Payload } from 'payload'
import { getPayloadClient } from '@/lib/payload'

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
  let recentEnrollments: any[] = []
  let pendingReviews: any[] = []

  if (payloadInstance) {
    try {
      const [courses, users, enrollments, lessons, reviews] = await Promise.all([
        payloadInstance.find({ collection: 'courses', limit: 200, depth: 0, overrideAccess: true }).catch(() => ({ docs: [], totalDocs: 0 })),
        payloadInstance.find({ collection: 'users', limit: 500, depth: 0, overrideAccess: true }).catch(() => ({ docs: [], totalDocs: 0 })),
        payloadInstance.find({ collection: 'enrollments', limit: 5, sort: '-createdAt', depth: 1, overrideAccess: true }).catch(() => ({ docs: [], totalDocs: 0 })),
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
      recentEnrollments = enrollments.docs || []

      lessonsCount = lessons.totalDocs || lessons.docs.length
      videoLessonsCount = lessons.docs.filter((l: any) => l.type === 'video').length

      totalReviewsCount = reviews.totalDocs || reviews.docs.length
      pendingReviews = reviews.docs.filter((r: any) => !r.approved)
      pendingReviewsCount = pendingReviews.length
    } catch (e) {
      console.error('[DashboardOverview] Error loading overview metrics:', e)
    }
  }

  const userName = currentUser?.name || currentUser?.email?.split('@')[0] || 'Instructor'
  const userRole = (currentUser?.role || 'admin').toUpperCase()

  return (
    <div className="custom-admin-dashboard">
      {/* Hero Welcome Card */}
      <section className="cad-hero">
        <div className="cad-hero-info">
          <div className="cad-badges">
            <span className="cad-badge role-badge">Role: {userRole}</span>
            <span className="cad-badge status-badge">Studio Online</span>
          </div>
          <h1 className="cad-title">Welcome back, {userName}.</h1>
          <p className="cad-subtitle">
            Manage your courses, curriculum, students, and publish modern learning experiences across Fieldnotes.
          </p>
        </div>
        <div className="cad-hero-actions">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="cad-btn cad-btn-secondary"
            title="View public website in new tab"
          >
            Live Site <span aria-hidden="true">↗</span>
          </a>
          <Link href="/dashboard" className="cad-btn cad-btn-primary">
            Student Space <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* KPI Stat Metrics Grid */}
      <section className="cad-stats-grid">
        <Link href="/admin/collections/courses" className="cad-stat-card">
          <div className="cad-stat-top">
            <span className="cad-stat-label">Courses</span>
            <span className="cad-stat-icon">🎓</span>
          </div>
          <div className="cad-stat-val">{coursesCount}</div>
          <div className="cad-stat-meta">
            <strong className="cad-meta-green">{publishedCourses} published</strong>
            <span> · {draftCourses} drafts</span>
          </div>
        </Link>

        <Link href="/admin/collections/enrollments" className="cad-stat-card">
          <div className="cad-stat-top">
            <span className="cad-stat-label">Active Students</span>
            <span className="cad-stat-icon">👥</span>
          </div>
          <div className="cad-stat-val">{studentsCount}</div>
          <div className="cad-stat-meta">
            <strong className="cad-meta-blue">{activeEnrollmentsCount} enrollments</strong>
            <span> recorded</span>
          </div>
        </Link>

        <Link href="/admin/collections/lessons" className="cad-stat-card">
          <div className="cad-stat-top">
            <span className="cad-stat-label">Total Lessons</span>
            <span className="cad-stat-icon">📚</span>
          </div>
          <div className="cad-stat-val">{lessonsCount}</div>
          <div className="cad-stat-meta">
            <span>{videoLessonsCount} video lessons</span>
          </div>
        </Link>

        <Link href="/admin/collections/reviews" className="cad-stat-card">
          <div className="cad-stat-top">
            <span className="cad-stat-label">Student Reviews</span>
            <span className="cad-stat-icon">⭐</span>
          </div>
          <div className="cad-stat-val">{totalReviewsCount}</div>
          <div className="cad-stat-meta">
            {pendingReviewsCount > 0 ? (
              <span className="cad-meta-warning">{pendingReviewsCount} pending approval</span>
            ) : (
              <span className="cad-meta-green">All reviews approved</span>
            )}
          </div>
        </Link>
      </section>

      {/* Quick Action Command Strip */}
      <section className="cad-actions-strip">
        <span className="cad-strip-label">QUICK CREATION</span>
        <div className="cad-strip-buttons">
          <Link href="/admin/collections/courses/create" className="cad-action-btn">
            <span>+</span> Course
          </Link>
          <Link href="/admin/collections/sections/create" className="cad-action-btn">
            <span>+</span> Section
          </Link>
          <Link href="/admin/collections/lessons/create" className="cad-action-btn">
            <span>+</span> Lesson
          </Link>
          <Link href="/admin/collections/posts/create" className="cad-action-btn">
            <span>+</span> Journal Post
          </Link>
          <Link href="/admin/collections/pages/create" className="cad-action-btn">
            <span>+</span> Page
          </Link>
          <Link href="/admin/collections/media/create" className="cad-action-btn">
            <span>+</span> Media
          </Link>
          <Link href="/admin/globals/site-settings" className="cad-action-btn">
            <span>⚙</span> Site Settings
          </Link>
        </div>
      </section>

      {/* Operations Overview Split */}
      <section className="cad-sections-split">
        {/* Left: Recent Enrollments */}
        <div className="cad-panel">
          <div className="cad-panel-header">
            <h3>Recent Enrollments</h3>
            <Link href="/admin/collections/enrollments" className="cad-panel-link">
              View All ↗
            </Link>
          </div>
          <div className="cad-panel-body">
            {recentEnrollments.length > 0 ? (
              <div className="cad-table-wrap">
                <table className="cad-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Course</th>
                      <th>Source</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentEnrollments.map((en: any) => {
                      const studentName = en.user?.name || en.user?.email || (typeof en.user === 'string' ? en.user : 'Student')
                      const courseTitle = en.course?.title || (typeof en.course === 'string' ? en.course : 'Course')
                      const dateStr = en.createdAt ? new Date(en.createdAt).toLocaleDateString() : 'Recent'
                      return (
                        <tr key={en.id}>
                          <td>
                            <strong className="cad-student-name">{studentName}</strong>
                          </td>
                          <td>
                            <span className="cad-course-title">{courseTitle}</span>
                          </td>
                          <td>
                            <span className={`cad-pill cad-pill-${en.source || 'free'}`}>
                              {en.source || 'active'}
                            </span>
                          </td>
                          <td className="cad-date">{dateStr}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="cad-empty">
                <p>No student enrollments recorded yet.</p>
                <Link href="/admin/collections/enrollments/create" className="cad-btn cad-btn-secondary cad-btn-sm">
                  Enroll Student Manually
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right: Review Queue & Studio Shortcuts */}
        <div className="cad-panel">
          <div className="cad-panel-header">
            <h3>Review Queue & Status</h3>
            <Link href="/admin/collections/reviews" className="cad-panel-link">
              Manage ↗
            </Link>
          </div>
          <div className="cad-panel-body">
            {pendingReviewsCount > 0 ? (
              <div className="cad-review-alert">
                <div className="cad-alert-icon">⚠️</div>
                <div className="cad-alert-content">
                  <h4>{pendingReviewsCount} Review{pendingReviewsCount > 1 ? 's' : ''} Awaiting Moderation</h4>
                  <p>Students have submitted feedback that requires administrator approval before appearing publicly.</p>
                  <Link href="/admin/collections/reviews" className="cad-btn cad-btn-warning cad-btn-sm">
                    Review and Approve ↗
                  </Link>
                </div>
              </div>
            ) : (
              <div className="cad-clean-state">
                <span className="cad-clean-icon">✓</span>
                <h4>Review Queue Is Clear</h4>
                <p>All student course reviews have been moderated and published.</p>
              </div>
            )}

            <div className="cad-shortcuts-list">
              <span className="cad-shortcuts-heading">STUDIO SHORTCUTS</span>
              <div className="cad-shortcut-links">
                <Link href="/admin/collections/categories" className="cad-shortcut-item">
                  <span>🏷 Categories</span>
                  <span>↗</span>
                </Link>
                <Link href="/admin/collections/instructors" className="cad-shortcut-item">
                  <span>👤 Instructors</span>
                  <span>↗</span>
                </Link>
                <Link href="/admin/collections/course-resources" className="cad-shortcut-item">
                  <span>📁 Course Files & PDFs</span>
                  <span>↗</span>
                </Link>
                <Link href="/admin/collections/users" className="cad-shortcut-item">
                  <span>🔐 Users & Permissions</span>
                  <span>↗</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="cad-divider">
        <span>COLLECTIONS ARCHITECTURE</span>
      </div>
    </div>
  )
}

export default DashboardOverview
