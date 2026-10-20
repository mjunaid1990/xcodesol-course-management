import type { CollectionConfig, Where } from 'payload'

const isStaff = (user?: unknown) => {
  if (!user || typeof user !== 'object' || !('role' in user)) return false
  return user.role === 'admin' || user.role === 'editor'
}

const readAccess: NonNullable<CollectionConfig['access']>['read'] = async ({ req }) => {
  if (isStaff(req.user)) return true

  const previews: Where = {
    and: [
      { 'lesson.freePreview': { equals: true } },
      { 'lesson.section.course._status': { equals: 'published' } },
    ],
  }
  if (req.user?.role !== 'student') return previews

  const enrollments = await req.payload.find({
    collection: 'enrollments',
    where: { and: [{ user: { equals: req.user.id } }, { status: { equals: 'active' } }] },
    limit: 500,
    depth: 0,
    overrideAccess: true,
  })
  const courseIDs = enrollments.docs.map((enrollment) => typeof enrollment.course === 'object' ? enrollment.course.id : enrollment.course)
  if (!courseIDs.length) return previews

  const courses = await req.payload.find({
    collection: 'courses',
    where: { and: [{ id: { in: courseIDs } }, { _status: { equals: 'published' } }] },
    limit: 500,
    depth: 0,
    overrideAccess: true,
  })
  const publishedCourseIDs = courses.docs.map((course) => course.id)
  if (!publishedCourseIDs.length) return previews

  return {
    or: [
      previews,
      { 'lesson.section.course': { in: publishedCourseIDs } },
    ],
  }
}

export const CourseResources: CollectionConfig = {
  slug: 'course-resources',
  upload: { mimeTypes: ['application/pdf', 'application/zip', 'text/plain'] },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'lesson', 'updatedAt'] },
  access: {
    read: readAccess,
    create: ({ req }) => isStaff(req.user),
    update: ({ req }) => isStaff(req.user),
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'lesson', type: 'relationship', relationTo: 'lessons', required: true, index: true },
  ],
}
