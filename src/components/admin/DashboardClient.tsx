'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

export type DashboardData = {
  userName: string
  userRole: string
  userEmail: string
  coursesCount: number
  publishedCourses: number
  draftCourses: number
  studentsCount: number
  activeEnrollmentsCount: number
  lessonsCount: number
  videoLessonsCount: number
  totalReviewsCount: number
  pendingReviewsCount: number
  recentEnrollments: Array<{
    id: string | number
    studentName: string
    courseTitle: string
    source: string
    date: string
  }>
}

export function DashboardClient({ data }: { data: DashboardData }) {
  const [isSkeleton, setIsSkeleton] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const currentDate = mounted
    ? new Date().toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Live Studio'

  return (
    <div className="modern-admin-dashboard">
      {/* Top Utility Bar */}
      <div className="mad-topbar">
        <div className="mad-system-status">
          <span className="mad-status-dot pulse-animation" />
          <span className="mad-status-text">Production Engine</span>
          <span className="mad-status-divider">•</span>
          <span className="mad-status-sub">PostgreSQL Connected</span>
        </div>

        <div className="mad-topbar-actions">
          <span className="mad-date-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {currentDate}
          </span>

          {/* Interactive Skeleton Animation Toggle */}
          <button
            type="button"
            className={`mad-skeleton-toggle ${isSkeleton ? 'active' : ''}`}
            onClick={() => setIsSkeleton(!isSkeleton)}
            title="Toggle Skeleton Shimmer Animation Preview"
          >
            <span className="mad-toggle-indicator" />
            <span>{isSkeleton ? 'Show Live Data' : 'Skeleton Shimmer'}</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="mad-pill-btn secondary"
            title="Open live public storefront in new tab"
          >
            <span>Live Site</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>

          <Link href="/dashboard" className="mad-pill-btn primary">
            <span>Student Space</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Hero Welcome Command Banner */}
      <section className="mad-hero-card">
        <div className="mad-hero-mesh" />
        <div className="mad-hero-content">
          <div className="mad-hero-user-row">
            <div className="mad-user-avatar">
              <span>{data.userName.slice(0, 2).toUpperCase()}</span>
              <span className="mad-avatar-online" />
            </div>

            <div className="mad-user-meta">
              <div className="mad-hero-tags">
                <span className="mad-badge role-tag">Role: {data.userRole}</span>
                <span className="mad-badge engine-tag">Fieldnotes CMS v3</span>
                <span className="mad-badge session-tag">Session: 7 Days</span>
              </div>
              <h1 className="mad-hero-title">
                {isSkeleton ? (
                  <span className="skeleton-line shimmer-effect w-60 h-8" />
                ) : (
                  <>Welcome back, {data.userName}.</>
                )}
              </h1>
              <p className="mad-hero-subtitle">
                {isSkeleton ? (
                  <span className="skeleton-line shimmer-effect w-90 h-4 mt-2" />
                ) : (
                  <>Studio command is active. Manage your curriculum, track real-time enrollments, and publish modern learning experiences.</>
                )}
              </p>
            </div>
          </div>

          <div className="mad-hero-kpi-chips">
            <div className="mad-kpi-chip">
              <span className="chip-label">Curriculum</span>
              <span className="chip-val">{data.coursesCount} Courses</span>
            </div>
            <div className="mad-kpi-chip">
              <span className="chip-label">Readiness</span>
              <span className="chip-val green">100% Video</span>
            </div>
            <div className="mad-kpi-chip">
              <span className="chip-label">Moderation</span>
              <span className="chip-val blue">Queue Clear</span>
            </div>
          </div>
        </div>
      </section>

      {/* KPI Stats Grid */}
      <section className="mad-stats-grid">
        {/* Card 1: Courses */}
        <Link href="/admin/collections/courses" className="mad-stat-card card-purple">
          <div className="mad-stat-header">
            <div className="mad-stat-icon-wrap icon-purple">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <span className="mad-stat-trend trend-green">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
              <span>{data.publishedCourses} Live</span>
            </span>
          </div>

          <div className="mad-stat-body">
            <span className="mad-stat-label">Total Courses</span>
            {isSkeleton ? (
              <div className="skeleton-box shimmer-effect w-24 h-10 my-2" />
            ) : (
              <div className="mad-stat-number">{data.coursesCount}</div>
            )}
            <div className="mad-stat-footer">
              <div className="mad-progress-track">
                <div
                  className="mad-progress-fill purple"
                  style={{ width: `${data.coursesCount > 0 ? (data.publishedCourses / data.coursesCount) * 100 : 100}%` }}
                />
              </div>
              <span className="mad-footer-meta">
                {data.publishedCourses} published • {data.draftCourses} draft
              </span>
            </div>
          </div>
        </Link>

        {/* Card 2: Active Students */}
        <Link href="/admin/collections/enrollments" className="mad-stat-card card-emerald">
          <div className="mad-stat-header">
            <div className="mad-stat-icon-wrap icon-emerald">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <span className="mad-stat-trend trend-blue">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 14 14" />
              </svg>
              <span>{data.activeEnrollmentsCount} Enrollments</span>
            </span>
          </div>

          <div className="mad-stat-body">
            <span className="mad-stat-label">Active Learners</span>
            {isSkeleton ? (
              <div className="skeleton-box shimmer-effect w-24 h-10 my-2" />
            ) : (
              <div className="mad-stat-number">{data.studentsCount}</div>
            )}
            <div className="mad-stat-footer">
              <div className="mad-progress-track">
                <div className="mad-progress-fill emerald" style={{ width: '85%' }} />
              </div>
              <span className="mad-footer-meta">
                {data.activeEnrollmentsCount} active enrolled seats
              </span>
            </div>
          </div>
        </Link>

        {/* Card 3: Video Lessons */}
        <Link href="/admin/collections/lessons" className="mad-stat-card card-sky">
          <div className="mad-stat-header">
            <div className="mad-stat-icon-wrap icon-sky">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
            </div>
            <span className="mad-stat-trend trend-sky">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span>Mux Video</span>
            </span>
          </div>

          <div className="mad-stat-body">
            <span className="mad-stat-label">Curriculum Modules</span>
            {isSkeleton ? (
              <div className="skeleton-box shimmer-effect w-24 h-10 my-2" />
            ) : (
              <div className="mad-stat-number">{data.lessonsCount}</div>
            )}
            <div className="mad-stat-footer">
              <div className="mad-progress-track">
                <div
                  className="mad-progress-fill sky"
                  style={{ width: `${data.lessonsCount > 0 ? (data.videoLessonsCount / data.lessonsCount) * 100 : 100}%` }}
                />
              </div>
              <span className="mad-footer-meta">
                {data.videoLessonsCount} video stream lessons
              </span>
            </div>
          </div>
        </Link>

        {/* Card 4: Reviews & Rating */}
        <Link href="/admin/collections/reviews" className="mad-stat-card card-amber">
          <div className="mad-stat-header">
            <div className="mad-stat-icon-wrap icon-amber">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <span className={`mad-stat-trend ${data.pendingReviewsCount > 0 ? 'trend-amber' : 'trend-green'}`}>
              {data.pendingReviewsCount > 0 ? 'Action Needed' : 'Approved'}
            </span>
          </div>

          <div className="mad-stat-body">
            <span className="mad-stat-label">Student Feedback</span>
            {isSkeleton ? (
              <div className="skeleton-box shimmer-effect w-24 h-10 my-2" />
            ) : (
              <div className="mad-stat-number">{data.totalReviewsCount}</div>
            )}
            <div className="mad-stat-footer">
              <div className="mad-progress-track">
                <div
                  className={`mad-progress-fill ${data.pendingReviewsCount > 0 ? 'amber' : 'emerald'}`}
                  style={{ width: '100%' }}
                />
              </div>
              <span className="mad-footer-meta">
                {data.pendingReviewsCount > 0
                  ? `${data.pendingReviewsCount} review(s) awaiting approval`
                  : 'All reviews moderated & public'}
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* Quick Action Command Palette */}
      <section className="mad-command-strip">
        <div className="mad-command-header">
          <span className="mad-command-title">QUICK DISPATCH</span>
          <span className="mad-command-hint">Instant Content Actions</span>
        </div>
        <div className="mad-command-buttons">
          <Link href="/admin/collections/courses/create" className="mad-cmd-btn cmd-purple">
            <span className="cmd-icon">+</span>
            <span>Course</span>
          </Link>
          <Link href="/admin/collections/sections/create" className="mad-cmd-btn cmd-blue">
            <span className="cmd-icon">+</span>
            <span>Section</span>
          </Link>
          <Link href="/admin/collections/lessons/create" className="mad-cmd-btn cmd-emerald">
            <span className="cmd-icon">+</span>
            <span>Lesson</span>
          </Link>
          <Link href="/admin/collections/posts/create" className="mad-cmd-btn cmd-indigo">
            <span className="cmd-icon">+</span>
            <span>Journal Post</span>
          </Link>
          <Link href="/admin/collections/pages/create" className="mad-cmd-btn cmd-teal">
            <span className="cmd-icon">+</span>
            <span>Page</span>
          </Link>
          <Link href="/admin/collections/media/create" className="mad-cmd-btn cmd-rose">
            <span className="cmd-icon">↑</span>
            <span>Upload Media</span>
          </Link>
          <Link href="/admin/globals/site-settings" className="mad-cmd-btn cmd-amber">
            <span className="cmd-icon">⚙</span>
            <span>Settings</span>
          </Link>
        </div>
      </section>

      {/* Two-Column Analytics & Live Feeds */}
      <section className="mad-two-col-grid">
        {/* Left: Recent Activity Feed */}
        <div className="mad-panel-card">
          <div className="mad-panel-header">
            <div className="mad-panel-title-wrap">
              <span className="mad-panel-dot" />
              <h3>Recent Student Enrollments</h3>
            </div>
            <Link href="/admin/collections/enrollments" className="mad-panel-link">
              <span>View All</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </Link>
          </div>

          <div className="mad-panel-body">
            {isSkeleton ? (
              <div className="skeleton-table-rows">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="skeleton-row shimmer-effect">
                    <div className="skeleton-avatar" />
                    <div className="skeleton-info">
                      <div className="skeleton-line w-40 h-4" />
                      <div className="skeleton-line w-60 h-3 mt-1" />
                    </div>
                    <div className="skeleton-pill w-16 h-6" />
                  </div>
                ))}
              </div>
            ) : data.recentEnrollments.length > 0 ? (
              <div className="mad-table-responsive">
                <table className="mad-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Curriculum</th>
                      <th>Method</th>
                      <th>Enrolled</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentEnrollments.map((item) => (
                      <tr key={item.id} className="mad-table-row">
                        <td>
                          <div className="mad-student-cell">
                            <div className="mad-student-avatar">
                              {item.studentName.slice(0, 2).toUpperCase()}
                            </div>
                            <span className="mad-student-name">{item.studentName}</span>
                          </div>
                        </td>
                        <td>
                          <span className="mad-course-tag">{item.courseTitle}</span>
                        </td>
                        <td>
                          <span className={`mad-source-badge ${item.source || 'free'}`}>
                            {item.source || 'active'}
                          </span>
                        </td>
                        <td className="mad-date-cell">{item.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mad-empty-state">
                <div className="mad-empty-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <h4>No Recent Enrollments Recorded</h4>
                <p>New learners will appear in real time once they enroll in your courses or register through the platform.</p>
                <div className="mad-empty-actions">
                  <Link href="/admin/collections/enrollments/create" className="mad-pill-btn secondary sm">
                    + Enroll Student Manually
                  </Link>
                  <Link href="/admin/collections/courses" className="mad-pill-btn primary sm">
                    Inspect Courses
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Studio Health & Quick Navigation */}
        <div className="mad-panel-card">
          <div className="mad-panel-header">
            <div className="mad-panel-title-wrap">
              <span className="mad-panel-dot emerald" />
              <h3>Curriculum Health & Navigation</h3>
            </div>
            <Link href="/admin/collections/reviews" className="mad-panel-link">
              <span>Reviews Queue</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </Link>
          </div>

          <div className="mad-panel-body">
            {/* Moderation Status Banner */}
            {data.pendingReviewsCount > 0 ? (
              <div className="mad-alert-banner warning">
                <div className="mad-alert-icon">⚠️</div>
                <div className="mad-alert-text">
                  <h5>{data.pendingReviewsCount} Review(s) Pending Moderation</h5>
                  <p>Students submitted new course feedback requiring approval.</p>
                  <Link href="/admin/collections/reviews" className="mad-alert-action">
                    Review and Approve ↗
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mad-clean-banner">
                <div className="mad-clean-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className="mad-clean-info">
                  <h5>Review Queue Is Clean</h5>
                  <p>All student feedback has been moderated and published.</p>
                </div>
              </div>
            )}

            {/* Platform Metrics Bars */}
            <div className="mad-health-metrics">
              <div className="mad-metric-row">
                <div className="mad-metric-info">
                  <span>Course Publishing Index</span>
                  <strong>{data.coursesCount > 0 ? Math.round((data.publishedCourses / data.coursesCount) * 100) : 100}%</strong>
                </div>
                <div className="mad-metric-bar">
                  <div className="mad-metric-fill purple" style={{ width: `${data.coursesCount > 0 ? (data.publishedCourses / data.coursesCount) * 100 : 100}%` }} />
                </div>
              </div>

              <div className="mad-metric-row">
                <div className="mad-metric-info">
                  <span>Video Stream Coverage</span>
                  <strong>{data.lessonsCount > 0 ? Math.round((data.videoLessonsCount / data.lessonsCount) * 100) : 100}%</strong>
                </div>
                <div className="mad-metric-bar">
                  <div className="mad-metric-fill sky" style={{ width: `${data.lessonsCount > 0 ? (data.videoLessonsCount / data.lessonsCount) * 100 : 100}%` }} />
                </div>
              </div>
            </div>

            {/* Studio Shortcuts Grid */}
            <div className="mad-shortcuts-grid">
              <Link href="/admin/collections/categories" className="mad-shortcut-card">
                <div className="mad-shortcut-icon">🏷️</div>
                <div className="mad-shortcut-text">
                  <span className="title">Categories</span>
                  <span className="desc">Manage taxonomy</span>
                </div>
                <span className="arrow">→</span>
              </Link>

              <Link href="/admin/collections/instructors" className="mad-shortcut-card">
                <div className="mad-shortcut-icon">👨‍🏫</div>
                <div className="mad-shortcut-text">
                  <span className="title">Instructors</span>
                  <span className="desc">Faculty profiles</span>
                </div>
                <span className="arrow">→</span>
              </Link>

              <Link href="/admin/collections/course-resources" className="mad-shortcut-card">
                <div className="mad-shortcut-icon">📁</div>
                <div className="mad-shortcut-text">
                  <span className="title">Files & PDFs</span>
                  <span className="desc">Downloadable media</span>
                </div>
                <span className="arrow">→</span>
              </Link>

              <Link href="/admin/collections/users" className="mad-shortcut-card">
                <div className="mad-shortcut-icon">🔐</div>
                <div className="mad-shortcut-text">
                  <span className="title">Permissions</span>
                  <span className="desc">Roles & access</span>
                </div>
                <span className="arrow">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative Collections Header Divider */}
      <div className="mad-section-divider">
        <div className="mad-divider-line" />
        <span className="mad-divider-pill">CONTENT & DATABASE ARCHITECTURE</span>
        <div className="mad-divider-line" />
      </div>
    </div>
  )
}
