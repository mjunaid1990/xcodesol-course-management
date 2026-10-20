import type { Metadata } from 'next'
import { CourseCards } from '@/components/RenderBlocks'
import { getPayloadClient } from '@/lib/payload'

export const metadata: Metadata = { title: 'Courses | Fieldnotes', description: 'Explore practical courses for thoughtful learners.' }

export default async function CoursesPage() {
  const payload = await getPayloadClient()
  const result = await payload.find({ collection: 'courses', where: { _status: { equals: 'published' } }, sort: 'title', limit: 100, depth: 2 })
  return <main className="catalog-page"><p className="eyebrow">THE COURSE LIBRARY</p><h1>Make space for<br /><em>what’s next.</em></h1><p className="catalog-intro">Thoughtful courses, made to help you build skills you can use and ideas you can carry with you.</p><CourseCards courses={result.docs} /></main>
}
