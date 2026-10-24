import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

const isStaff = (user?: unknown) => {
  if (!user || typeof user !== 'object' || !('role' in user)) return false
  return user.role === 'admin' || user.role === 'editor'
}
const getID = (value: unknown) => typeof value === 'object' && value !== null && 'id' in value ? String(value.id) : String(value || '')

const verifyLessonAccess: CollectionBeforeChangeHook = async ({ data, operation, originalDoc, req }) => {
  if (isStaff(req.user)) return data
  if (req.user?.role !== 'student') throw new Error('Sign in to update lesson progress.')

  const lessonID = getID(data.lesson || originalDoc?.lesson)
  if (!lessonID) throw new Error('A lesson is required.')
  const lesson = await req.payload.findByID({ collection: 'lessons', id: lessonID, depth: 2, overrideAccess: true })
  const section = typeof lesson.section === 'object' ? lesson.section : null
  const course = section && typeof section.course === 'object' ? section.course : null
  if (!course || course._status !== 'published') throw new Error('This lesson is unavailable.')

  const enrollment = await req.payload.find({
    collection: 'enrollments',
    where: { and: [{ user: { equals: req.user.id } }, { course: { equals: course.id } }, { status: { equals: 'active' } }] },
    limit: 1,
    overrideAccess: true,
  })
  if (!lesson.freePreview && enrollment.docs.length === 0) throw new Error('Enroll in this course to update lesson progress.')

  if (operation === 'create') data.user = req.user.id
  else {
    if (getID(originalDoc?.user) !== req.user.id) throw new Error('You can only update your own progress.')
    data.user = req.user.id
  }
  if (data.completed === true) data.completedAt ||= new Date().toISOString()
  else if (data.completed === false) data.completedAt = null
  return data
}

export const LessonProgress: CollectionConfig = {
  slug: 'lesson-progress',
  indexes: [{ fields: ['user', 'lesson'], unique: true }],
  admin: { useAsTitle: 'lesson', defaultColumns: ['user', 'lesson', 'completed', 'updatedAt'] },
  access: {
    read: ({ req }) => req.user?.role === 'admin' ? true : req.user ? { user: { equals: req.user.id } } : false,
    create: ({ req }) => req.user?.role === 'student' || isStaff(req.user),
    update: ({ req }) => req.user?.role === 'student' || isStaff(req.user),
    delete: ({ req }) => req.user?.role === 'admin',
  },
  hooks: { beforeChange: [verifyLessonAccess] },
  fields: [
    { name: 'user', type: 'relationship', relationTo: 'users', required: true, index: true },
    { name: 'lesson', type: 'relationship', relationTo: 'lessons', required: true, index: true },
    { name: 'completed', type: 'checkbox', defaultValue: false },
    { name: 'completedAt', type: 'date' },
    { name: 'notes', type: 'textarea', maxLength: 5000 },
  ],
}
