import { headers } from 'next/headers'
import { z } from 'zod'
import { getPayloadClient } from '@/lib/payload'

const progressSchema = z.object({ lessonID: z.union([z.string(), z.number()]), completed: z.boolean(), notes: z.string().max(5000) })

export async function POST(request: Request) {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await headers() })
  if (!user || user.role !== 'student') return Response.json({ message: 'Sign in to save lesson progress.' }, { status: 401 })
  const parsed = progressSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return Response.json({ message: 'Progress details are invalid.' }, { status: 400 })

  try {
    await payload.findByID({ collection: 'lessons', id: parsed.data.lessonID, user, overrideAccess: false })
    const existing = await payload.find({
      collection: 'lesson-progress',
      where: { and: [{ user: { equals: user.id } }, { lesson: { equals: parsed.data.lessonID } }] },
      limit: 1,
      user,
      overrideAccess: false,
    })
    const data = { lesson: parsed.data.lessonID, user: user.id, completed: parsed.data.completed, notes: parsed.data.notes }
    if (existing.docs[0]) {
      await payload.update({ collection: 'lesson-progress', id: existing.docs[0].id, data, user, overrideAccess: false })
    } else {
      await payload.create({ collection: 'lesson-progress', data, user, overrideAccess: false })
    }
    return Response.json({ saved: true })
  } catch {
    return Response.json({ message: 'Enroll in this course before saving progress.' }, { status: 403 })
  }
}
