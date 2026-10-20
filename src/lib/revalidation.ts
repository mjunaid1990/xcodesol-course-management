import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, PayloadRequest } from 'payload'

type ContentCollection = 'courses' | 'pages' | 'posts'

function getPaths(collection: ContentCollection, slug?: string) {
  if (collection === 'courses') return ['/courses', '/', '/sitemap.xml', ...(slug ? [`/courses/${encodeURIComponent(slug)}`] : [])]
  if (collection === 'posts') return ['/blog', '/', '/sitemap.xml', ...(slug ? [`/blog/${encodeURIComponent(slug)}`] : [])]
  return ['/', '/sitemap.xml', ...(slug ? [slug === 'home' ? '/' : `/${encodeURIComponent(slug)}`] : [])]
}

export function contentChangeHooks(collection: ContentCollection) {
  const revalidate: CollectionAfterChangeHook = async ({ doc, previousDoc }) => {
    const slugs = new Set([doc.slug, previousDoc?.slug].filter((value): value is string => typeof value === 'string'))
    const paths = new Set([...getPaths(collection), ...Array.from(slugs).flatMap((slug) => getPaths(collection, slug))])
    for (const path of paths) revalidatePath(path)
    return doc
  }

  const revalidateDelete: CollectionAfterDeleteHook = async ({ doc }) => {
    for (const path of getPaths(collection, doc.slug)) revalidatePath(path)
    return doc
  }

  return { afterChange: [revalidate], afterDelete: [revalidateDelete] }
}

const getID = (value: unknown) => typeof value === 'object' && value !== null && 'id' in value ? String(value.id) : String(value || '')

async function revalidateCurriculumCourse(req: PayloadRequest, courseID: unknown, lessonID?: unknown) {
  if (!courseID) return
  const course = await req.payload.findByID({ collection: 'courses', id: getID(courseID), depth: 0, overrideAccess: true })
  for (const path of ['/courses', '/', '/sitemap.xml', `/courses/${encodeURIComponent(course.slug)}`, `/learn/${encodeURIComponent(course.slug)}`]) revalidatePath(path)
  if (lessonID) revalidatePath(`/learn/${encodeURIComponent(course.slug)}/${encodeURIComponent(getID(lessonID))}`)
}

const revalidateSectionChange: CollectionAfterChangeHook = async ({ doc, previousDoc, req }) => {
  await Promise.all([revalidateCurriculumCourse(req, doc.course), revalidateCurriculumCourse(req, previousDoc?.course)])
  return doc
}

const revalidateSectionDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  await revalidateCurriculumCourse(req, doc.course)
  return doc
}

export const sectionRevalidationHooks = { afterChange: [revalidateSectionChange], afterDelete: [revalidateSectionDelete] }

const revalidateLessonChange: CollectionAfterChangeHook = async ({ doc, previousDoc, req }) => {
  const sectionIDs = new Set([getID(doc.section), getID(previousDoc?.section)].filter(Boolean))
  const sections = await Promise.all(Array.from(sectionIDs, (id) => req.payload.findByID({ collection: 'sections', id, depth: 0, overrideAccess: true })))
  await Promise.all(sections.map((section) => revalidateCurriculumCourse(req, section.course, doc.id)))
  return doc
}

const revalidateLessonDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  const section = await req.payload.findByID({ collection: 'sections', id: getID(doc.section), depth: 0, overrideAccess: true })
  await revalidateCurriculumCourse(req, section.course, doc.id)
  return doc
}

export const lessonRevalidationHooks = { afterChange: [revalidateLessonChange], afterDelete: [revalidateLessonDelete] }
