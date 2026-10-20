import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import { EnrollButton } from '@/components/EnrollButton'
import { CheckoutButton } from '@/components/CheckoutButton'
import { getPayloadClient } from '@/lib/payload'

type Props = { params: Promise<{ courseSlug: string }> }

export default async function LearnCoursePage({ params }: Props) {
  const { courseSlug } = await params
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await headers() })
  if (!user || user.role !== 'student') redirect(`/login?next=${encodeURIComponent(`/learn/${courseSlug}`)}`)

  const courseResult = await payload.find({ collection: 'courses', where: { and: [{ slug: { equals: courseSlug } }, { _status: { equals: 'published' } }] }, limit: 1, depth: 0 })
  const course = courseResult.docs[0]
  if (!course) notFound()
  const enrollmentResult = await payload.find({ collection: 'enrollments', where: { and: [{ user: { equals: user.id } }, { course: { equals: course.id } }, { status: { equals: 'active' } }] }, limit: 1, user, overrideAccess: false })
  if (!enrollmentResult.docs.length) {
    return <main className="course-detail"><p className="eyebrow">YOUR NEXT STEP</p><h1>{course.title}</h1><p className="catalog-intro">Enroll to open your lessons and save your progress.</p><div className="course-price-card">{Number(course.price) > 0 ? <CheckoutButton courseID={String(course.id)} slug={courseSlug} /> : <EnrollButton courseID={String(course.id)} slug={courseSlug} />}<p>Return to the <Link href={`/courses/${courseSlug}`}>course overview</Link>.</p></div></main>
  }

  const sections = await payload.find({ collection: 'sections', where: { course: { equals: course.id } }, sort: 'order', limit: 100, depth: 0, user, overrideAccess: false })
  const lessonLists = await Promise.all(sections.docs.map((section) => payload.find({ collection: 'lessons', where: { section: { equals: section.id } }, sort: 'order', limit: 200, depth: 0, user, overrideAccess: false })))
  const lessons = lessonLists.flatMap((list) => list.docs)
  const progress = lessons.length ? await payload.find({ collection: 'lesson-progress', where: { and: [{ user: { equals: user.id } }, { lesson: { in: lessons.map((lesson) => lesson.id) } }] }, limit: 500, user, overrideAccess: false }) : { docs: [] }
  const completed = new Set(progress.docs.filter((item) => item.completed).map((item) => typeof item.lesson === 'object' ? item.lesson.id : item.lesson))
  const nextLesson = lessons.find((lesson) => !completed.has(lesson.id)) || lessons[0]
  const completion = lessons.length ? Math.round((completed.size / lessons.length) * 100) : 0

  return <main className="dashboard-page"><p className="eyebrow">YOUR COURSE</p><h1>{course.title}</h1><p className="catalog-intro">{lessons.length} lessons <span aria-hidden="true">·</span> {completed.size} completed</p><section className="learning-progress" aria-label={`${completion}% course complete`}><div className="learning-progress-heading"><span>YOUR PROGRESS</span><strong>{completion}%</strong></div><div className="learning-progress-track"><span style={{ width: `${completion}%` }} /></div><p>{completed.size === lessons.length && lessons.length ? 'Course complete. Lovely work.' : `${lessons.length - completed.size} lessons left in this course`}</p></section>{nextLesson && <Link className="button button-primary" href={`/learn/${courseSlug}/${nextLesson.id}`}>{completed.size ? 'Continue learning' : 'Start learning'} ↗</Link>}<div className="learning-sections">{sections.docs.map((section, sectionIndex) => <section key={section.id}><h2>{sectionIndex + 1}. {section.title}</h2>{lessonLists[sectionIndex].docs.map((lesson, lessonIndex) => <Link className="learning-lesson" href={`/learn/${courseSlug}/${lesson.id}`} key={lesson.id}><span className="lesson-check">{completed.has(lesson.id) ? '✓' : `${lessonIndex + 1}`}</span><span>{lesson.title}</span>{typeof lesson.durationMinutes === 'number' && <small>{lesson.durationMinutes} min</small>}</Link>)}</section>)}</div></main>
}
