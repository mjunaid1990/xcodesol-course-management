import Mux from '@mux/ts'
import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

type RouteContext = { params: Promise<{ lessonID: string }> }
const isStaff = (user?: unknown) => {
  if (!user || typeof user !== 'object' || !('role' in user)) return false
  return user.role === 'admin' || user.role === 'editor'
}

export async function GET(request: Request, { params }: RouteContext) {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: request.headers })
  const { lessonID } = await params

  let lesson
  try {
    lesson = await payload.findByID({ collection: 'lessons', id: lessonID, depth: 2, overrideAccess: true })
  } catch {
    return NextResponse.json({ message: 'Video is unavailable.' }, { status: 404 })
  }

  const section = typeof lesson.section === 'object' ? lesson.section : null
  const course = section && typeof section.course === 'object' ? section.course : null
  const playbackId = typeof lesson.videoAssetId === 'string' ? lesson.videoAssetId.trim() : ''
  if (!course || course._status !== 'published' || lesson.type !== 'video' || !playbackId) {
    return NextResponse.json({ message: 'Video is unavailable.' }, { status: 404 })
  }

  if (!isStaff(user) && !lesson.freePreview) {
    if (!user || user.role !== 'student') return NextResponse.json({ message: 'Sign in to watch this lesson.' }, { status: 401 })
    const enrollment = await payload.find({
      collection: 'enrollments',
      where: { and: [{ user: { equals: user.id } }, { course: { equals: course.id } }, { status: { equals: 'active' } }] },
      limit: 1,
      user,
      overrideAccess: false,
    })
    if (!enrollment.docs.length) return NextResponse.json({ message: 'Enroll in this course to watch this lesson.' }, { status: 404 })
  }

  const keyId = process.env.MUX_SIGNING_KEY_ID
  const privateKey = process.env.MUX_PRIVATE_KEY
  if (!keyId || !privateKey) return NextResponse.json({ message: 'Video playback is not configured.' }, { status: 503 })

  try {
    const mux = new Mux({ jwtSigningKey: keyId, jwtPrivateKey: privateKey })
    const durationMinutes = typeof lesson.durationMinutes === 'number' ? lesson.durationMinutes : 45
    const expirationHours = Math.min(24, Math.max(1, Math.ceil((durationMinutes + 15) / 60)))
    const signedTokens = await mux.jwt.signPlaybackId(playbackId, {
      type: ['video', 'thumbnail', 'storyboard'],
      expiration: `${expirationHours}h`,
    })

    return NextResponse.json({
      playbackId,
      tokens: {
        playback: signedTokens['playback-token'],
        thumbnail: signedTokens['thumbnail-token'],
        storyboard: signedTokens['storyboard-token'],
      },
    }, { headers: { 'Cache-Control': 'private, no-store, max-age=0' } })
  } catch {
    return NextResponse.json({ message: 'A video playback token could not be issued.' }, { status: 503 })
  }
}
