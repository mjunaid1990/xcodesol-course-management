import Stripe from 'stripe'
import { getPayloadClient } from '@/lib/payload'
import { getPaymentProvider, type PaymentProvider } from '@/lib/payments/provider'

async function recordPaidSession(payload: Awaited<ReturnType<typeof getPayloadClient>>, session: Stripe.Checkout.Session, isPaymentRefunded: (paymentIntentID: string) => Promise<boolean>) {
  const metadata = session.metadata
  const userID = metadata?.userID
  const courseID = metadata?.courseID
  const expectedAmount = Number(metadata?.amount)
  const expectedCurrency = metadata?.currency?.toLowerCase()
  if (
    session.mode !== 'payment' || session.payment_status !== 'paid' ||
    !userID || !courseID || session.client_reference_id !== userID ||
    !Number.isSafeInteger(expectedAmount) || session.amount_total !== expectedAmount ||
    session.currency?.toLowerCase() !== expectedCurrency
  ) throw new Error('Paid session metadata or totals are invalid.')

  const [userResult, courseResult] = await Promise.all([
    payload.findByID({ collection: 'users', id: userID, depth: 0, overrideAccess: true }),
    payload.findByID({ collection: 'courses', id: courseID, depth: 0, overrideAccess: true }),
  ])
  const paymentIntentID = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id
  if (!paymentIntentID) throw new Error('Paid session is missing its payment intent.')
  if (await isPaymentRefunded(paymentIntentID)) return
  const bySession = await payload.find({ collection: 'enrollments', where: { orderReference: { equals: session.id } }, limit: 1, overrideAccess: true })
  const byOwnerCourse = bySession.docs[0] ? bySession : await payload.find({
    collection: 'enrollments',
    where: { and: [{ user: { equals: userResult.id } }, { course: { equals: courseResult.id } }] },
    limit: 1,
    overrideAccess: true,
  })
  const existing = byOwnerCourse.docs[0]
  if (existing && existing.status !== 'active') return
  const data = {
    user: userResult.id,
    course: courseResult.id,
    status: 'active' as const,
    source: 'stripe' as const,
    orderReference: session.id,
    paymentIntentId: paymentIntentID,
  }
  if (existing) await payload.update({ collection: 'enrollments', id: existing.id, data, overrideAccess: true })
  else await payload.create({ collection: 'enrollments', data, overrideAccess: true })
}

async function revokeRefundedEnrollment(payload: Awaited<ReturnType<typeof getPayloadClient>>, charge: Stripe.Charge) {
  if (!charge.refunded) return
  const paymentIntentID = typeof charge.payment_intent === 'string' ? charge.payment_intent : charge.payment_intent?.id
  if (!paymentIntentID) return
  const enrollments = await payload.find({ collection: 'enrollments', where: { paymentIntentId: { equals: paymentIntentID } }, limit: 100, overrideAccess: true })
  await Promise.all(enrollments.docs.filter((item) => item.status === 'active').map((item) => payload.update({
    collection: 'enrollments',
    id: item.id,
    data: { status: 'refunded' },
    overrideAccess: true,
  })))
}

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature')
  if (!signature) return Response.json({ message: 'Missing Stripe signature.' }, { status: 400 })

  let provider: PaymentProvider
  try {
    provider = getPaymentProvider()
  } catch {
    return Response.json({ message: 'Stripe webhook is not configured.' }, { status: 503 })
  }

  let event: Stripe.Event
  try {
    event = provider.constructWebhookEvent(await request.text(), signature)
  } catch {
    return Response.json({ message: 'Invalid Stripe webhook signature.' }, { status: 400 })
  }

  try {
    const payload = await getPayloadClient()
    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      await recordPaidSession(payload, event.data.object as Stripe.Checkout.Session, (paymentIntentID) => provider.isPaymentRefunded(paymentIntentID))
    } else if (event.type === 'charge.refunded') {
      await revokeRefundedEnrollment(payload, event.data.object as Stripe.Charge)
    }
    return Response.json({ received: true })
  } catch {
    return Response.json({ message: 'Webhook processing failed.' }, { status: 500 })
  }
}
