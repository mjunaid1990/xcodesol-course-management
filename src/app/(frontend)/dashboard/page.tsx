import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'

export default async function DashboardPage() {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await headers() })
  if (!user || user.role !== 'student') redirect('/login')
  const result = await payload.find({ collection: 'enrollments', where: { and: [{ user: { equals: user.id } }, { status: { equals: 'active' } }] }, limit: 100, depth: 2, user, overrideAccess: false })
  const enrollments = result.docs
  return <main className="dashboard-page"><p className="eyebrow">YOUR LEARNING SPACE</p><h1>Welcome back{user.name ? `, ${user.name}` : ''}.</h1><p className="catalog-intro">Keep building on what you know, one lesson at a time.</p>{enrollments.length ? <div className="course-cards">{enrollments.map((enrollment) => { const course = typeof enrollment.course === 'object' ? enrollment.course : null; return course ? <Link className="course-card" href={`/learn/${course.slug}`} key={enrollment.id}><div className="course-card-art"><span>✳</span></div><div className="course-card-content"><span className="course-category">CONTINUE LEARNING</span><h3>{course.title}</h3><p>{course.summary}</p><span className="course-card-cta">Open course <span aria-hidden="true">↗</span></span></div></Link> : null })}</div> : <section className="empty-learning"><span>✳</span><h2>Your learning journey starts here.</h2><p>Once you enroll in a course, you’ll find it waiting for you here.</p><Link className="button button-primary" href="/courses">Explore courses ↗</Link></section>}</main>
}
