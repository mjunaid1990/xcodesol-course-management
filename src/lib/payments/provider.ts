import Stripe from 'stripe'

export type CheckoutInput = {
  userID: string
  email: string
  courseID: string
  courseTitle: string
  courseSlug: string
  amount: number
  currency: string
  origin: string
}

export interface PaymentProvider {
  createCheckout(input: CheckoutInput): Promise<{ url: string | null }>
  constructWebhookEvent(payload: string, signature: string): Stripe.Event
  isPaymentRefunded(paymentIntentID: string): Promise<boolean>
}

export class StripePaymentProvider implements PaymentProvider {
  private readonly stripe: Stripe
  private readonly webhookSecret: string

  constructor(secretKey: string, webhookSecret: string) {
    this.stripe = new Stripe(secretKey)
    this.webhookSecret = webhookSecret
  }

  async createCheckout(input: CheckoutInput) {
    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: input.email,
      client_reference_id: input.userID,
      line_items: [{
        quantity: 1,
        price_data: {
          currency: input.currency,
          unit_amount: input.amount,
          product_data: { name: input.courseTitle },
        },
      }],
      metadata: {
        userID: input.userID,
        courseID: input.courseID,
        amount: String(input.amount),
        currency: input.currency,
      },
      payment_intent_data: { metadata: { userID: input.userID, courseID: input.courseID } },
      success_url: `${input.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${input.origin}/courses/${encodeURIComponent(input.courseSlug)}`,
    }, { idempotencyKey: `course-${input.userID}-${input.courseID}-${new Date().toISOString().slice(0, 10)}` })
    return { url: session.url }
  }

  constructWebhookEvent(payload: string, signature: string) {
    return this.stripe.webhooks.constructEvent(payload, signature, this.webhookSecret)
  }

  async isPaymentRefunded(paymentIntentID: string) {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentID, { expand: ['latest_charge'] })
    const charge = paymentIntent.latest_charge
    return typeof charge === 'object' && charge !== null && 'refunded' in charge && charge.refunded === true
  }
}

export function getPaymentProvider(): PaymentProvider {
  const secretKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secretKey || !webhookSecret) throw new Error('Stripe is not configured.')
  return new StripePaymentProvider(secretKey, webhookSecret)
}

const currencies = new Set(['usd', 'eur', 'gbp', 'cad', 'aud'])

export function toStripeAmount(price: number, currency: string): { amount: number; currency: string } | null {
  const normalizedCurrency = currency.trim().toLowerCase()
  if (!currencies.has(normalizedCurrency) || !Number.isFinite(price) || price <= 0) return null
  const amount = Math.round(price * 100)
  if (!Number.isSafeInteger(amount) || amount <= 0) return null
  return { amount, currency: normalizedCurrency }
}
