import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'

export default async function DashboardPage() {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await headers() })

  if (!user) {
    redirect('/login?next=/dashboard')
  }

  const isStaff = user.role === 'admin' || user.role === 'editor'

  // Student enrollments (also queried for staff so they can preview their student view)
  const result = await payload.find({
    collection: 'enrollments',
    where: { and: [{ user: { equals: user.id } }, { status: { equals: 'active' } }] },
    limit: 100,
    depth: 2,
    user,
    overrideAccess: isStaff,
  })
  const enrollments = result.docs

  // If instructor / admin, load platform overview numbers
  let staffStats: {
    coursesCount: number
    publishedCourses: number
    enrollmentsCount: number
    pendingReviewsCount: number
    recentEnrollments: any[]
  } | null = null

  if (isStaff) {
    try {
      const [allCourses, allEnrollments, allReviews] = await Promise.all([
        payload.find({ collection: 'courses', limit: 100, depth: 0, overrideAccess: true }),
        payload.find({ collection: 'enrollments', limit: 6, sort: '-createdAt', depth: 1, overrideAccess: true }),
        payload.find({ collection: 'reviews', limit: 20, sort: '-createdAt', depth: 0, overrideAccess: true }),
      ])

      staffStats = {
        coursesCount: allCourses.totalDocs || allCourses.docs.length,
        publishedCourses: allCourses.docs.filter((c: any) => c._status === 'published').length,
        enrollmentsCount: allEnrollments.totalDocs || allEnrollments.docs.length,
        pendingReviewsCount: allReviews.docs.filter((r: any) => !r.approved).length,
        recentEnrollments: allEnrollments.docs || [],
      }
    } catch (e) {
      console.error('[DashboardPage] Error loading staff stats:', e)
    }
  }

  return (
    <main className="dashboard-page">
      {isStaff ? (
        /* INSTRUCTOR / PLATFORM ADMIN DASHBOARD */
        <div className="instructor-space">
          <div className="dashboard-header-block">
            <div className="eyebrow-row">
              <p className="eyebrow">
                <span className="eyebrow-dot" /> INSTRUCTOR & CMS SPACE
              </p>
              <span className="role-pill">{user.role?.toUpperCase()}</span>
            </div>
            <h1>Welcome back{user.name ? `, ${user.name}` : ''}.</h1>
            <p className="catalog-intro">
              Platform overview, learning activity, and direct shortcuts to the Fieldnotes visual CMS studio.
            </p>
          </div>

          {/* Quick Actions Header Bar */}
          <div className="instructor-cta-bar">
            <div className="cta-left">
              <Link className="button button-primary" href="/admin">
                Launch Studio CMS <span aria-hidden="true">↗</span>
              </Link>
              <Link className="button button-light" href="/admin/collections/courses/create">
                + New Course
              </Link>
              <Link className="button button-light" href="/admin/collections/posts/create">
                + Write Post
              </Link>
            </div>
            <div className="cta-right">
              <Link className="text-link" href="/admin/globals/site-settings">
                Site Settings <span>↗</span>
              </Link>
            </div>
          </div>

          {/* KPI Stat Cards */}
          {staffStats && (
            <div className="instructor-metrics-grid">
              <Link href="/admin/collections/courses" className="metric-box">
                <span className="metric-label">Published Courses</span>
                <strong className="metric-val">{staffStats.publishedCourses}</strong>
                <span className="metric-sub">{staffStats.coursesCount} total curriculum</span>
              </Link>
              <Link href="/admin/collections/enrollments" className="metric-box">
                <span className="metric-label">Active Enrollments</span>
                <strong className="metric-val">{staffStats.enrollmentsCount}</strong>
                <span className="metric-sub">Across all courses</span>
              </Link>
              <Link href="/admin/collections/reviews" className="metric-box">
                <span className="metric-label">Pending Reviews</span>
                <strong className={`metric-val ${staffStats.pendingReviewsCount > 0 ? 'text-orange' : ''}`}>
                  {staffStats.pendingReviewsCount}
                </strong>
                <span className="metric-sub">
                  {staffStats.pendingReviewsCount > 0 ? 'Awaiting moderation ↗' : 'Queue is clear'}
                </span>
              </Link>
              <Link href="/admin/collections/users" className="metric-box">
                <span className="metric-label">Staff & Access</span>
                <strong className="metric-val">Manage</strong>
                <span className="metric-sub">Users, roles, credentials</span>
              </Link>
            </div>
          )}

          {/* Recent Enrollments Table */}
          {staffStats && staffStats.recentEnrollments.length > 0 && (
            <section className="dashboard-section">
              <div className="section-title-row">
                <h2>Recent Student Enrollments</h2>
                <Link href="/admin/collections/enrollments" className="text-link">
                  Manage all enrollments <span>↗</span>
                </Link>
              </div>
              <div className="activity-card">
                <table className="clean-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Course</th>
                      <th>Source</th>
                      <th>Enrolled On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffStats.recentEnrollments.map((en: any) => {
                      const studentName = en.user?.name || en.user?.email || (typeof en.user === 'string' ? en.user : 'Student')
                      const courseTitle = en.course?.title || (typeof en.course === 'string' ? en.course : 'Course')
                      const dateStr = en.createdAt ? new Date(en.createdAt).toLocaleDateString() : 'Recent'
                      return (
                        <tr key={en.id}>
                          <td><strong>{studentName}</strong></td>
                          <td>{courseTitle}</td>
                          <td><span className="badge-pill">{en.source || 'active'}</span></td>
                          <td className="text-muted">{dateStr}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Student Preview Section */}
          <section className="dashboard-section">
            <div className="section-title-row">
              <h2>My Enrolled Courses (Student Test-Drive)</h2>
              <span className="text-muted">Preview player and learning experience</span>
            </div>
            {enrollments.length ? (
              <div className="course-cards">
                {enrollments.map((enrollment) => {
                  const course = typeof enrollment.course === 'object' ? enrollment.course : null
                  return course ? (
                    <Link className="course-card" href={`/learn/${course.slug}`} key={enrollment.id}>
                      <div className="course-card-art">
                        <span>✳</span>
                      </div>
                      <div className="course-card-content">
                        <span className="course-category">LEARNING PLAYER</span>
                        <h3>{course.title}</h3>
                        <p>{course.summary}</p>
                        <span className="course-card-cta">
                          Open course player <span aria-hidden="true">↗</span>
                        </span>
                      </div>
                    </Link>
                  ) : null
                })}
              </div>
            ) : (
              <div className="empty-sub-card">
                <p>You have not enrolled this staff account in any specific courses yet.</p>
                <Link className="button button-light" href="/courses">
                  Browse Course Catalog ↗
                </Link>
              </div>
            )}
          </section>
        </div>
      ) : (
        /* STUDENT LEARNING SPACE */
        <div className="student-space">
          <p className="eyebrow">
            <span className="eyebrow-dot" /> YOUR LEARNING SPACE
          </p>
          <h1>Welcome back{user.name ? `, ${user.name}` : ''}.</h1>
          <p className="catalog-intro">Keep building on what you know, one lesson at a time.</p>
          {enrollments.length ? (
            <div className="course-cards">
              {enrollments.map((enrollment) => {
                const course = typeof enrollment.course === 'object' ? enrollment.course : null
                return course ? (
                  <Link className="course-card" href={`/learn/${course.slug}`} key={enrollment.id}>
                    <div className="course-card-art">
                      <span>✳</span>
                    </div>
                    <div className="course-card-content">
                      <span className="course-category">CONTINUE LEARNING</span>
                      <h3>{course.title}</h3>
                      <p>{course.summary}</p>
                      <span className="course-card-cta">
                        Open course <span aria-hidden="true">↗</span>
                      </span>
                    </div>
                  </Link>
                ) : null
              })}
            </div>
          ) : (
            <section className="empty-learning">
              <span>✳</span>
              <h2>Your learning journey starts here.</h2>
              <p>Once you enroll in a course, you’ll find it waiting for you here.</p>
              <Link className="button button-primary" href="/courses">
                Explore courses ↗
              </Link>
            </section>
          )}
        </div>
      )}
    </main>
  )
}
