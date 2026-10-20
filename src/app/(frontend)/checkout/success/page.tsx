import Link from 'next/link'

export default function CheckoutSuccessPage() {
  return <main className="auth-page checkout-success"><p className="eyebrow">PAYMENT RECEIVED</p><h1>Thanks for<br /><em>joining us.</em></h1><p className="auth-intro">Your course access is being confirmed. It may take a few moments for the payment notification to arrive.</p><Link className="button button-primary" href="/dashboard">Go to my learning <span aria-hidden="true">↗</span></Link></main>
}
