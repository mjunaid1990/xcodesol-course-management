import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

const isStaff = (user?: unknown) => {
  if (!user || typeof user !== 'object' || !('role' in user)) return false
  return user.role === 'admin' || user.role === 'editor'
}
const getID = (value: unknown) => typeof value === 'object' && value !== null && 'id' in value ? String(value.id) : String(value || '')

const enforceEnrollment: CollectionBeforeChangeHook = async ({ data, operation, originalDoc, req }) => {
  if (isStaff(req.user)) return data
  if (req.user?.role !== 'student') throw new Error('Sign in as a student to write a review.')

  const userID = req.user.id
  const courseID = getID(data.course || originalDoc?.course)
  if (!courseID) throw new Error('A course is required.')
  const course = await req.payload.findByID({ collection: 'courses', id: courseID, depth: 0, overrideAccess: true })
  if (course._status !== 'published') throw new Error('This course is unavailable.')

  const enrollments = await req.payload.find({
    collection: 'enrollments',
    where: { and: [{ user: { equals: userID } }, { course: { equals: courseID } }, { status: { equals: 'active' } }] },
    limit: 1,
    overrideAccess: true,
  })
  if (!enrollments.docs.length) throw new Error('Enroll in this course before reviewing it.')

  if (operation === 'create') data.user = userID
  else {
    if (getID(originalDoc?.user) !== userID) throw new Error('You can only update your own review.')
    data.user = userID
  }
  data.approved = false
  return data
}

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  indexes: [{ fields: ['user', 'course'], unique: true }],
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'course', 'rating', 'approved', 'createdAt'] },
  access: {
    read: ({ req }) => isStaff(req.user) ? true : { approved: { equals: true } },
    create: ({ req }) => req.user?.role === 'student' || isStaff(req.user),
    update: ({ req }) => isStaff(req.user) ? true : req.user?.role === 'student' ? { user: { equals: req.user.id } } : false,
    delete: ({ req }) => req.user?.role === 'admin',
  },
  hooks: { beforeChange: [enforceEnrollment] },
  fields: [
    { name: 'title', type: 'text', required: true, maxLength: 120 },
    { name: 'body', type: 'textarea', required: true, maxLength: 3000 },
    { name: 'rating', type: 'number', required: true, min: 1, max: 5 },
    { name: 'user', type: 'relationship', relationTo: 'users', required: true, index: true, admin: { readOnly: true } },
    { name: 'course', type: 'relationship', relationTo: 'courses', required: true, index: true },
    { name: 'approved', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' }, access: { update: ({ req: { user } }) => user?.role === 'admin' } },
  ],
}
