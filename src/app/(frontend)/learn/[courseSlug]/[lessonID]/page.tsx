import Link from 'next/link'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { LessonProgressForm } from '@/components/LessonProgressForm'
import { SecureVideoPlayer } from '@/components/SecureVideoPlayer'
import { getPayloadClient } from '@/lib/payload'

type Props = { params: Promise<{ courseSlug: string; lessonID: string }> }
const getID = (value: unknown) => typeof value === 'object' && value !== null && 'id' in value ? String(value.id) : String(value || '')

export default async function LessonPage({ params }: Props) {
  const { courseSlug, lessonID } = await params
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await headers() })
  const courseResult = await payload.find({ collection: 'courses', where: { and: [{ slug: { equals: courseSlug } }, { _status: { equals: 'published' } }] }, limit: 1, depth: 0 })
  const course = courseResult.docs[0]
  if (!course) notFound()

  let lesson
  try {
    lesson = await payload.findByID({ collection: 'lessons', id: lessonID, depth: 2, user: user || undefined, overrideAccess: false })
  } catch {
    notFound()
  }
  const section = typeof lesson.section === 'object' ? lesson.section : null
  const lessonCourse = section && typeof section.course === 'object' ? section.course : null
  if (!section || !lessonCourse || String(lessonCourse.id) !== String(course.id)) notFound()
  if (user?.role !== 'admin' && user?.role !== 'editor' && !lesson.freePreview) {
    if (!user || user.role !== 'student') redirect(`/login?next=${encodeURIComponent(`/learn/${courseSlug}/${lessonID}`)}`)
    const enrollment = await payload.find({ collection: 'enrollments', where: { and: [{ user: { equals: user.id } }, { course: { equals: course.id } }, { status: { equals: 'active' } }] }, limit: 1, user, overrideAccess: false })
    if (!enrollment.docs.length) notFound()
  }

  const lessonList = await payload.find({ collection: 'lessons', where: { section: { equals: section.id } }, sort: 'order', limit: 200, depth: 0, user: user || undefined, overrideAccess: false })
  const currentIndex = lessonList.docs.findIndex((item) => String(item.id) === String(lesson.id))
  const previous = currentIndex > 0 ? lessonList.docs[currentIndex - 1] : null
  const next = currentIndex >= 0 ? lessonList.docs[currentIndex + 1] : null
  let progressItem: { completed?: boolean; notes?: string } | undefined
  if (user?.role === 'student') {
    const progress = await payload.find({ collection: 'lesson-progress', where: { and: [{ user: { equals: user.id } }, { lesson: { equals: lesson.id } }] }, limit: 1, user, overrideAccess: false })
    progressItem = progress.docs[0] as unknown as { completed?: boolean; notes?: string } | undefined
  }

  return <main className="lesson-page"><nav className="lesson-breadcrumb"><Link href={`/learn/${courseSlug}`}>{course.title}</Link><span>/</span><span>{section.title}</span></nav><div className="lesson-layout"><article className="lesson-content"><p className="eyebrow">{lesson.type === 'video' ? 'VIDEO LESSON' : lesson.type === 'resource' ? 'COURSE RESOURCE' : 'LESSON'}</p><h1>{lesson.title}</h1>{lesson.type === 'text' && lesson.content && <div className="lesson-rich-text"><RichText data={lesson.content as never} /></div>}{lesson.type === 'video' && (lesson.videoAssetId ? <SecureVideoPlayer lessonID={String(lesson.id)} title={lesson.title} /> : <div className="lesson-media-placeholder">The video playback ID has not been configured.</div>)}{lesson.type === 'resource' && <div className="lesson-media-placeholder"><p>Course files will appear here through protected downloads.</p></div>}{lesson.type === 'quiz' && <div className="lesson-media-placeholder"><p>Quiz activities are coming soon.</p></div>}{user?.role === 'student' && <LessonProgressForm lessonID={String(lesson.id)} initialCompleted={progressItem?.completed} initialNotes={progressItem?.notes} />}<div className="lesson-pagination">{previous ? <Link href={`/learn/${courseSlug}/${previous.id}`}>← Previous lesson</Link> : <span />}{next ? <Link href={`/learn/${courseSlug}/${next.id}`}>Next lesson →</Link> : <Link href={`/learn/${courseSlug}`}>Back to course</Link>}</div></article><aside className="lesson-sidebar"><p className="eyebrow">COURSE CONTENT</p><h2>{course.title}</h2><Link href={`/learn/${courseSlug}`} className="sidebar-course-link">All lessons</Link><div className="sidebar-current">{section.title}<span>{lesson.title}</span></div></aside></div></main>
}
