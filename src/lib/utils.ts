export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(' ')
}

export function formatCurrency(amount: number | string, currency = 'USD'): string {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  if (isNaN(numericAmount)) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(numericAmount)
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '—'
  const d = new Date(date)
  if (isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d)
}

export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '0 min'
  const mins = Math.floor(seconds / 60)
  const remainingSecs = seconds % 60
  if (mins === 0) return `${remainingSecs}s`
  if (remainingSecs === 0) return `${mins} min`
  return `${mins}m ${remainingSecs}s`
}
