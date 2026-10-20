import { headers } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'
import { getPaymentProvider, toStripeAmount, type PaymentProvider } from '@/lib/payments/provider'

export async function POST(request: Request) {
  let provider: PaymentProvider
  try {
    provider = getPaymentProvider()
  } catch {
    return Response.json({ message: 'Checkout is not configured yet.' }, { status: 503 })
  }

  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await headers() })
  if (!user || user.role !== 'student') return Response.json({ message: 'Sign in as a student to continue.' }, { status: 401 })
  if (!user.email) return Response.json({ message: 'Your account must have an email address to check out.' }, { status: 400 })

  const body = await request.json().catch(() => null) as { courseID?: unknown } | null
  if (typeof body?.courseID !== 'string' && typeof body?.courseID !== 'number') return Response.json({ message: 'A valid course is required.' }, { status: 400 })

  const result = await payload.find({
    collection: 'courses',
    where: { and: [{ id: { equals: body.courseID } }, { _status: { equals: 'published' } }] },
    limit: 1,
    depth: 0,
  })
  const course = result.docs[0]
  if (!course) return Response.json({ message: 'Course not found.' }, { status: 404 })
  if (Number(course.price) <= 0) return Response.json({ message: 'This course is free. Use free enrollment instead.' }, { status: 400 })

  const existing = await payload.find({
    collection: 'enrollments',
    where: { and: [{ user: { equals: user.id } }, { course: { equals: course.id } }] },
    limit: 1,
    overrideAccess: true,
  })
  if (existing.docs[0]?.status === 'active') return Response.json({ message: 'You are already enrolled.' }, { status: 409 })
  if (existing.docs.length) return Response.json({ message: 'Enrollment is inactive. Contact the instructor for help.' }, { status: 403 })

  const pricing = toStripeAmount(Number(course.price), String(course.currency || 'USD'))
  if (!pricing) return Response.json({ message: 'This course has an unsupported price or currency.' }, { status: 400 })

  const origin = process.env.NEXT_PUBLIC_SERVER_URL ? new URL(process.env.NEXT_PUBLIC_SERVER_URL).origin : new URL(request.url).origin
  try {
    const checkout = await provider.createCheckout({
      userID: String(user.id),
      email: user.email,
      courseID: String(course.id),
      courseTitle: course.title,
      courseSlug: course.slug,
      amount: pricing.amount,
      currency: pricing.currency,
      origin,
    })
    if (!checkout.url) return Response.json({ message: 'Checkout could not be started.' }, { status: 502 })
    return Response.json({ url: checkout.url })
  } catch {
    return Response.json({ message: 'Checkout could not be started. Please try again.' }, { status: 502 })
  }
}
