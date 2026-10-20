import { headers } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'

export async function POST(request: Request) {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await headers() })
  if (!user || user.role !== 'student') return Response.json({ message: 'Sign in as a student to enroll.' }, { status: 401 })

  const body = await request.json().catch(() => null) as { courseID?: unknown } | null
  if (typeof body?.courseID !== 'string' && typeof body?.courseID !== 'number') {
    return Response.json({ message: 'A valid course is required.' }, { status: 400 })
  }

  const courseResult = await payload.find({
    collection: 'courses',
    where: { and: [{ id: { equals: body.courseID } }, { _status: { equals: 'published' } }, { price: { equals: 0 } }] },
    limit: 1,
    depth: 0,
  })
  const course = courseResult.docs[0]
  if (!course) return Response.json({ message: 'This course is not available for free enrollment.' }, { status: 404 })

  const existing = await payload.find({
    collection: 'enrollments',
    where: { and: [{ user: { equals: user.id } }, { course: { equals: course.id } }] },
    limit: 1,
    overrideAccess: true,
  })
  if (existing.docs[0]?.status === 'active') return Response.json({ enrolled: true }, { status: 200 })
  if (existing.docs.length) return Response.json({ message: 'Enrollment is inactive. Contact the instructor for help.' }, { status: 403 })

  try {
    await payload.create({
      collection: 'enrollments',
      data: { user: user.id, course: course.id, status: 'active', source: 'free' },
      overrideAccess: true,
    })
  } catch {
    const concurrent = await payload.find({
      collection: 'enrollments',
      where: { and: [{ user: { equals: user.id } }, { course: { equals: course.id } }, { status: { equals: 'active' } }] },
      limit: 1,
      overrideAccess: true,
    })
    if (!concurrent.docs.length) return Response.json({ message: 'Enrollment could not be completed.' }, { status: 409 })
  }
  return Response.json({ enrolled: true }, { status: 201 })
}
