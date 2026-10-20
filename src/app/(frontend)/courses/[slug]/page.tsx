import type { Metadata } from 'next'
import Link from 'next/link'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { CheckoutButton } from '@/components/CheckoutButton'
import { PreviewBanner } from '@/components/PreviewBanner'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { EnrollButton } from '@/components/EnrollButton'
import { getPayloadClient } from '@/lib/payload'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayloadClient()
  const { isEnabled } = await draftMode()
  const result = await payload.find({ collection: 'courses', where: { slug: { equals: slug }, ...(!isEnabled ? { _status: { equals: 'published' as const } } : {}) }, limit: 1, depth: 1, draft: isEnabled, overrideAccess: isEnabled })
  const course = result.docs[0]
  if (!course) return {}
  const seo = course.seo as { title?: string; description?: string } | null
  const thumbnail = course.thumbnail && typeof course.thumbnail === 'object' ? course.thumbnail as { url?: string; alt?: string } : null
  return { title: seo?.title || course.title, description: seo?.description || course.summary, openGraph: { title: seo?.title || course.title, description: seo?.description || course.summary, images: thumbnail?.url ? [{ url: thumbnail.url, alt: thumbnail.alt || course.title }] : undefined } }
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const { isEnabled } = await draftMode()
  const result = await payload.find({ collection: 'courses', where: { slug: { equals: slug }, ...(!isEnabled ? { _status: { equals: 'published' as const } } : {}) }, limit: 1, depth: 2, draft: isEnabled, overrideAccess: isEnabled })
  const course = result.docs[0]
  if (!course) notFound()
  const sectionResult = await payload.find({ collection: 'sections', where: { course: { equals: course.id } }, sort: 'order', limit: 100, depth: 1, overrideAccess: isEnabled })
  const category = course.category && typeof course.category === 'object' ? String(course.category.name || '') : ''
  const outcomes = Array.isArray(course.learningOutcomes) ? course.learningOutcomes : []
  const requirements = Array.isArray(course.requirements) ? course.requirements : []
  const faqs = Array.isArray(course.faqs) ? course.faqs : []
  const jsonLd = { '@context': 'https://schema.org', '@type': 'Course', name: course.title, description: course.summary, provider: { '@type': 'Organization', name: 'Fieldnotes' }, inLanguage: course.language || 'English', offers: { '@type': 'Offer', price: Number(course.price).toFixed(2), priceCurrency: String(course.currency || 'USD').toUpperCase(), availability: 'https://schema.org/InStock', url: `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/courses/${slug}` } }
  const safeJsonLd = JSON.stringify(jsonLd).replace(/</g, '\\u003c')
  return <><PreviewBanner enabled={isEnabled} /><main className="course-detail">{!isEnabled && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd }} />}<header className="course-detail-header"><p className="eyebrow">{category || course.level || 'FIELDNOTES COURSE'}</p><h1>{course.title}</h1><p>{course.summary}</p></header><div className="course-detail-columns"><article className="course-detail-main"><h2>What you’ll learn</h2>{outcomes.length ? <ul className="course-bullet-list">{outcomes.map((item: { item?: string }, index: number) => <li key={index}>{item.item}</li>)}</ul> : <p className="course-description">Course details are being prepared.</p>}<h2>About this course</h2>{course.description ? <div className="course-description"><RichText data={course.description as never} /></div> : <p className="course-description">{course.summary}</p>}{sectionResult.docs.length > 0 && <><h2>Course curriculum</h2><div className="course-curriculum">{sectionResult.docs.map((section: Record<string, unknown>, sectionIndex: number) => { const lessons = section.lessons && typeof section.lessons === 'object' && 'docs' in section.lessons ? (section.lessons as { docs: Array<Record<string, unknown>> }).docs : []; return <section key={String(section.id || sectionIndex)}><h3>{String(section.title || '')}</h3>{lessons.length ? lessons.map((lesson, lessonIndex) => <div className="curriculum-lesson" key={String(lesson.id || lessonIndex)}>{lesson.freePreview ? <Link href={`/learn/${slug}/${String(lesson.id)}`}>{String(lesson.title || '')}</Link> : <span>{String(lesson.title || '')}</span>}{lesson.freePreview && <span className="preview-label">Preview</span>}{typeof lesson.durationMinutes === 'number' && <small>{lesson.durationMinutes} min</small>}</div>) : <p className="course-description">Lesson details available with enrollment.</p>}</section> })}</div></>}{requirements.length > 0 && <><h2>Requirements</h2><ul className="course-bullet-list">{requirements.map((item: { item?: string }, index: number) => <li key={index}>{item.item}</li>)}</ul></>}{faqs.length > 0 && <><h2>Frequently asked questions</h2>{faqs.map((faq: { question?: string; answer?: string }, index: number) => <details className="faq-block" key={index}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</>}</article><aside className="course-price-card"><strong>{Number(course.price) > 0 ? `${String(course.currency || 'USD')} ${Number(course.price).toFixed(2)}` : 'Free'}</strong>{isEnabled ? <p>Preview mode. Enrollment is disabled.</p> : Number(course.price) > 0 ? <CheckoutButton courseID={String(course.id)} slug={slug} /> : <EnrollButton courseID={String(course.id)} slug={slug} />}<p>Learn at your own pace, with lifetime course access.</p></aside></div></main></>
}
